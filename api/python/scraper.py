# Описание на целта на скрипта:
# Този скрипт извлича информация за книга от предоставен URL. 
# Той използва библиотеките requests и BeautifulSoup за зареждане и парсиране на съдържанието на страницата, 
# като извлича различни данни като заглавие на книгата, контрибутори (автори, редактори и други), 
# рейтинг, брой оценки, описание, брой страници, форма на книгата, първа публикация и други метаинформации.
# Освен това, скриптът извлича и JSON данни от страницата, които предоставят допълнителна информация за книгата, 
# като жанрове, награди и език. Данните се форматират в удобен за анализ вид и се извеждат на екрана.

import sys
import json
import requests
import re
import html2text
import io
from bs4 import BeautifulSoup
from datetime import datetime, timezone

# Проверка дали е подаден URL като аргумент
if len(sys.argv) < 2:
    print(json.dumps({"error": "URL is required."}))
    sys.exit(1)

# Вземане на URL от аргумента на командния ред
URL = sys.argv[1]

# Настройка на изходния поток за правилно изобразяване на UTF-8 символи
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Функция за извличане на данни за книгата
def scrape_book_data():
    # Изпращане на GET заявка за зареждане на страницата
    try:
        response = requests.get(URL)
        if response.status_code != 200:
            print(json.dumps({"error": f"Failed to fetch the page. Status code: {response.status_code}"}))
            sys.exit(1)
    except requests.RequestException as e:
        print(json.dumps({"error": f"Request failed: {str(e)}"}))
        sys.exit(1)

    # Парсиране на съдържанието на страницата с BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Намиране на скрипт с JSON данни (__NEXT_DATA__)
    script = soup.find('script', id='__NEXT_DATA__')
    if not script:
        print(json.dumps({"error": "Could not find __NEXT_DATA__ JSON on the page."}))
        sys.exit(1)

    # Парсиране на JSON данните
    try:
        json_data = json.loads(script.string)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Failed to parse __NEXT_DATA__ JSON."}))
        sys.exit(1)

    # Извличане на apolloState от JSON за по-нататъшно извличане на информация
    page_props = json_data.get('props', {}).get('pageProps', {})
    apollo_state = page_props.get('apolloState', {})

    # Извличане на ID на книгата от URL
    book_id = "N/A"
    match = re.search(r'book/show/(\d+)', URL)
    if match:
        book_id = match.group(1)

    # Намиране на ключовете за детайлите на книгата, произведението и поредицата
    book_details_key = next(
        (key for key, value in apollo_state.items() if value.get('webUrl', '').find(book_id) != -1 and value.get('__typename') == 'Book'),
        None
    )
    work_details_key = next(
        (key for key, value in apollo_state.items() if value.get('__typename') == 'Work'),
        None
    )
    series_details_key = next(
        (key for key, value in apollo_state.items() if value.get('__typename') == 'Series'),
        None
    )

    # Инициализация на контейнерите за данни
    book_property = apollo_state.get(book_details_key, {}) if book_details_key else {}
    book_details = book_property.get('details', {})
    work_property = apollo_state.get(work_details_key, {}) if work_details_key else {}
    work_details = work_property.get('details', {})
    series_property = apollo_state.get(series_details_key, {}) if series_details_key else {}

    # Извличане на основни данни за книгата
    title = book_property.get('title', 'N/A')
    original_title = work_details.get('originalTitle', 'N/A')

    # Извличане на информация за първата публикация
    first_publication_info = work_details.get('publicationTime', None)
    if first_publication_info and first_publication_info > 0:
        first_publication_info = datetime.fromtimestamp(first_publication_info / 1000, tz=timezone.utc).strftime('%B %d, %Y')
    else:
        first_publication_info = 'N/A'

    # URL на корицата
    image_url = book_property.get('imageUrl', 'N/A')
    # Заглавие на поредицата
    series_title = series_property.get('title', 'N/A') if series_property else 'N/A'

    # Извличане на описание (предпочита се "stripped" версия)
    description = book_property.get('description({\"stripped\":true})', None)
    if description is None:
        # Ако липсва, използва се обикновена версия и се премахват HTML таговете
        description = book_property.get('description', 'N/A')
        if description != 'N/A':
            h = html2text.HTML2Text()
            h.ignore_links = True
            h.ignore_images = True
            description = h.handle(description).strip()
    else:
        description = description.strip() if description else 'N/A'

    # Извличане на контрибутори
    primary_contributor_edge = book_property.get('primaryContributorEdge', {})
    primary_contributor_ref = primary_contributor_edge.get('node', {}).get('__ref', None)
    primary_contributor = apollo_state.get(primary_contributor_ref, {}).get('name', 'N/A') if primary_contributor_ref else 'N/A'

    secondary_contributors = []
    for edge in book_property.get('secondaryContributorEdges', []):
        contributor_ref = edge.get('node', {}).get('__ref', None)
        if contributor_ref:
            contributor_name = apollo_state.get(contributor_ref, {}).get('name', 'N/A')
            if contributor_name != 'N/A':
                secondary_contributors.append(contributor_name)

    # Форматиране на контрибуторите със запетая, без роли
    formatted_contributors = ", ".join(
        [primary_contributor] + secondary_contributors
    ) if primary_contributor != 'N/A' else 'N/A'

    # Извличане на жанрове
    genres = ", ".join(
        genre_info['genre']['name']
        for genre_info in book_property.get('bookGenres', [])
    ) or 'N/A'

    # Извличане на информация за публикация
    publication_time = book_details.get('publicationTime', None)
    if publication_time and publication_time > 0:
        publication_time = datetime.fromtimestamp(publication_time / 1000, tz=timezone.utc).strftime('%B %d, %Y')
    else:
        publication_time = 'N/A'

    # Издател, ISBN и език
    publisher = book_details.get('publisher', 'N/A')
    isbn13 = book_details.get('isbn13', 'N/A')
    isbn10 = book_details.get('isbn', 'N/A')
    asin = book_details.get('asin', 'N/A')
    language = book_details.get('language', {}).get('name', 'N/A')
    pages_count = book_details.get('numPages', 'N/A')
    book_format = book_details.get('format', 'N/A')

    # Извличане на статистики за произведението
    stats = work_property.get('stats', {})
    rating = stats.get('averageRating', 'N/A')
    ratings_count = stats.get('ratingsCount', 'N/A')
    reviews_count = stats.get('textReviewsCount', 'N/A')

    # Извличане на награди, места и герои
    literary_awards = ", ".join(
        (
            f"{award['name']} ({datetime.fromtimestamp(award['awardedAt'] / 1000, tz=timezone.utc).strftime('%Y')})"
            if award.get('awardedAt') and award['awardedAt'] > 0 else award['name']
        )
        for award in work_details.get('awardsWon', [])
    ) or 'N/A'

    places = ", ".join(
        f"{place['name']} ({', '.join(filter(None, [place.get('countryName'), str(place.get('year'))]))})"
        if place.get('countryName') or place.get('year') else place['name']
        for place in work_details.get('places', [])
    ) or 'N/A'

    characters = ", ".join(
        character['name'] for character in work_details.get('characters', [])[:10]
    ) or 'N/A'

    # Форматиране на крайния резултат
    result = {
        "title": title,
        "original_title": original_title,
        "contributors": formatted_contributors,
        "rating": rating,
        "ratings_count": ratings_count,
        "reviews_count": reviews_count,
        "description": description,
        "genres": genres,
        "pages_count": pages_count,
        "book_format": book_format,
        "first_publication_info": first_publication_info,
        "publisher": publisher,
        "publication_time": publication_time,
        "literary_awards": literary_awards,
        "setting": places,
        "characters": characters,
        "image_url": image_url,
        "series": series_title,
        "isbn13": isbn13,
        "isbn10": isbn10,
        "asin": asin,
        "language": language
    }

    # Print the JSON
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    scrape_book_data()