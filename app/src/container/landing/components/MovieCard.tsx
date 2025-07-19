// Define the type for the recommendation data
interface Recommendation {
  imdbID: string;
  poster: string;
  bgName: string; // Main title
  title: string; // English title
  genre: string;
  runtimeGoogle?: string;
  runtime: string;
  type: "movie" | "series";
  totalSeasons?: string;
  year: string;
  rated: string;
  imdbRating: string;
  imdbVotes: string;
  metascore: string;
  ratings?: { Source: string; Value: string }[];
  reason?: string;
  description: string;
  plot: string;
  director: string;
  writer: string;
  actors: string;
  production?: string;
  released: string;
  language: string;
  country: string;
  awards: string;
  boxOffice?: string;
  DVD?: string;
  website?: string;
  youtubeTrailerUrl?: string;
}

// Chinatown movie data to match the reference image
const defaultRecommendation: Recommendation = {
  imdbID: "tt0071315",
  poster: "/placeholder.svg?height=1300&width=1000",
  bgName: "Chinatown",
  title: "Chinatown",
  genre: "Drama, Mystery, Thriller",
  runtime: "2h 10m",
  type: "movie",
  year: "1974",
  rated: "R",
  imdbRating: "8.1",
  imdbVotes: "364,484",
  metascore: "92",
  ratings: [
    { Source: "Internet Movie Database", Value: "8.1/10" },
    { Source: "Rotten Tomatoes", Value: "98%" },
    { Source: "Metacritic", Value: "92/100" }
  ],
  reason:
    "This neo-noir film is full of tension and multi-layered plots that will keep your attention until the very end.",
  description:
    "Jake Gittes, a private detective, is involved in a case that turns out to be much more complex than it initially appeared, with corruption and intrigue around water rights...",
  plot: "In 1937 Los Angeles, private detective Jake 'J.J.' Gittes is hired in a case of adultery. The current situation leads him to Hollis Mulwray, head...",
  director: "Roman Polanski",
  writer: "Robert Towne, Roman Polanski",
  actors: "Jack Nicholson, Faye Dunaway, John Huston",
  production: "N/A",
  released: "20 Jun 1974",
  language: "English, Cantonese, Spanish",
  country: "USA",
  awards: "Won 1 Oscar. 21 wins & 21 nominations",
  boxOffice: "$29,200,000",
  DVD: "N/A",
  website: "N/A",
  youtubeTrailerUrl: "https://www.youtube.com/embed/example"
};

interface MovieCardVRProps {
  position?: string;
  recommendation?: Recommendation;
}

// Helper function to determine Metascore color based on value
function getMetascoreColor(metascore: string): string {
  const score = Number.parseInt(metascore);
  if (isNaN(score)) return "#AAA";
  if (score >= 60) return "#54A72A"; // Green
  if (score >= 40) return "#FFCC33"; // Yellow
  return "#FF0000"; // Red
}

const MovieCardVR = ({
  position = "0 2.5 -4",
  recommendation = defaultRecommendation
}: MovieCardVRProps) => {
  const isMovie = recommendation.type === "movie";
  const runtime = recommendation.runtimeGoogle || recommendation.runtime;
  const rottenTomatoesRating =
    recommendation.ratings?.find(
      (rating) => rating.Source === "Rotten Tomatoes"
    )?.Value || "N/A";

  // Define dimensions for proper two-column layout
  const cardWidth = 9.0;
  const cardHeight = 6.0;
  const posterWidth = 2.5;
  const posterHeight = 3.8;
  const gapBetweenPosterAndText = 0.15;
  const textContentWidth =
    cardWidth - posterWidth - gapBetweenPosterAndText - 0.5;

  // Position poster on the left side of the card, aligned to top
  const posterX = -cardWidth / 2 + posterWidth / 2 + 0.2;
  const posterY = cardHeight / 2 - posterHeight / 2 - 0.2; // Move poster to top of card

  // Position text content right after the poster, starting at the same top level as poster
  const textX = posterX + posterWidth / 2 + gapBetweenPosterAndText;
  const textStartY = cardHeight / 2 - 0.2; // Start text at the top of the card, same level as poster top

  return (
    <a-entity
      position={position}
      class="clickable"
      color-changer
      dynamic-body="mass: 0"
      grabbable
      stretchable
      draggable
    >
      {/* Background Panel - Dark like in reference */}
      <a-plane
        width={cardWidth}
        height={cardHeight}
        color="#1a1a1a"
        material="shader: flat; opacity: 0.95"
      ></a-plane>

      {/* Poster Group - Left side, aligned to top */}
      <a-entity position={`${posterX} ${posterY} 0.01`}>
        <a-image
          src={recommendation.poster}
          position="0 0 0"
          width={posterWidth}
          height={posterHeight}
          material="shader: flat"
        ></a-image>

        {/* Bookmark Button */}
        <a-image
          src="/placeholder.svg?height=50&width=50"
          position={`${-posterWidth / 2 + 0.2} ${posterHeight / 2 - 0.2} 0.02`}
          width="0.25"
          height="0.25"
          class="clickable"
          onClick={() =>
            console.log("Bookmark clicked for:", recommendation.title)
          }
        ></a-image>
      </a-entity>

      {/* Text Content Group - Right side, starting at poster top level */}
      <a-entity position={`${textX} 0 0.01`}>
        {/* Main Title - starts at the same level as poster top */}
        <a-text
          value={recommendation.bgName || "Title Not Available"}
          position={`0 ${textStartY} 0`}
          align="left"
          color="#FFFFFF"
          width={textContentWidth * 1.2}
          wrap-count="55"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        ></a-text>

        {/* English Title in Italics */}
        <a-text
          value={recommendation.title || ""}
          position={`0 ${textStartY - 0.25} 0`}
          align="left"
          color="#CCCCCC"
          width={textContentWidth * 1.0}
          wrap-count="55"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        ></a-text>

        {/* Genre and Details */}
        <a-text
          value={`${recommendation.genre || "Genre Unknown"} | ${
            runtime || "Unknown Runtime"
          } | ${recommendation.year || "Year Unknown"} | Rating: ${
            recommendation.rated || "N/A"
          }`}
          position={`0 ${textStartY - 0.45} 0`}
          align="left"
          color="#CCCCCC"
          width={textContentWidth * 0.8}
          wrap-count="70"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        ></a-text>

        {/* Ratings Row */}
        <a-entity position={`0 ${textStartY - 0.7} 0`}>
          {/* IMDb Rating */}
          <a-text
            value={`IMDb: ⭐ ${recommendation.imdbRating || "N/A"} / ${
              recommendation.imdbVotes || "N/A"
            } votes`}
            position="0 0 0"
            align="left"
            color="#FFCC33"
            width={textContentWidth / 2.8}
            wrap-count="35"
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          ></a-text>

          {/* Metascore */}
          {isMovie && (
            <a-entity position={`${textContentWidth / 2.5 + 0.3} 0 0`}>
              <a-plane
                width="0.4"
                height="0.18"
                color={getMetascoreColor(recommendation.metascore)}
                material="shader: flat"
              ></a-plane>
              <a-text
                value={recommendation.metascore || "N/A"}
                position="0 0 0.01"
                align="center"
                color="#FFFFFF"
                width="0.8"
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              ></a-text>
              <a-text
                value="Metascore"
                position="0.8 0 0"
                align="left"
                color="#FFFFFF"
                width="1.8"
                font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
              ></a-text>
            </a-entity>
          )}

          {/* Rotten Tomatoes */}
          {isMovie && (
            <a-text
              value={`🍅 ${rottenTomatoesRating}`}
              position={`${textContentWidth / 1.5 + 0.5} 0 0`}
              align="left"
              color="#FF6347"
              width={textContentWidth / 2.5}
              wrap-count="15"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
            ></a-text>
          )}
        </a-entity>

        {/* Why we recommend */}
        {recommendation.reason && (
          <a-entity position={`0 ${textStartY - 0.95} 0`}>
            <a-text
              value="Why we recommend Chinatown?"
              position="0 0 0"
              align="left"
              color="#FFFFFF"
              width={textContentWidth * 1.0}
              wrap-count="55"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
            ></a-text>
            <a-text
              value={recommendation.reason}
              position="0 -0.3 0"
              align="left"
              color="#CCCCCC"
              width={textContentWidth * 0.7}
              wrap-count="70"
              font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
            ></a-text>
          </a-entity>
        )}

        {/* Description */}
        <a-entity position={`0 ${textStartY - 1.55} 0`}>
          <a-text
            value="Description"
            position="0 0 0"
            align="left"
            color="#FFFFFF"
            width={textContentWidth * 1.0}
            wrap-count="55"
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          ></a-text>
          <a-text
            value={recommendation.description}
            position="0 -0.3 0"
            align="left"
            color="#CCCCCC"
            width={textContentWidth * 0.7}
            wrap-count="70"
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
          ></a-text>
          <a-text
            value="Full description"
            position="0 -0.5 0"
            align="left"
            color="#4A9EFF"
            width={textContentWidth * 0.8}
            wrap-count="55"
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
            class="clickable"
          ></a-text>
        </a-entity>

        {/* Plot */}
        <a-entity position={`0 ${textStartY - 2.3} 0`}>
          <a-text
            value="Plot"
            position="0 0 0"
            align="left"
            color="#FFFFFF"
            width={textContentWidth * 1.0}
            wrap-count="55"
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          ></a-text>
          <a-text
            value={recommendation.plot}
            position="0 -0.3 0"
            align="left"
            color="#CCCCCC"
            width={textContentWidth * 0.7}
            wrap-count="70"
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
          ></a-text>
          <a-text
            value="Full plot"
            position="0 -0.5 0"
            align="left"
            color="#4A9EFF"
            width={textContentWidth * 0.8}
            wrap-count="55"
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
            class="clickable"
          ></a-text>
        </a-entity>

        {/* Additional Information */}
        <a-entity position={`0 ${textStartY - 3.05} 0`}>
          <a-text
            value="Additional Information:"
            position="0 0 0"
            align="left"
            color="#FFFFFF"
            width={textContentWidth * 1.0}
            wrap-count="55"
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          ></a-text>
          <a-text
            value={`Director: ${
              recommendation.director || "Unknown"
            }    Screenwriter: ${recommendation.writer || "Unknown"}\nActors: ${
              recommendation.actors || "Unknown"
            }    Production: ${
              recommendation.production || "N/A"
            }    Release: ${recommendation.released || "N/A"}\nLanguage: ${
              recommendation.language || "Unknown"
            }    Country: ${recommendation.country || "Unknown"}    Awards: ${
              recommendation.awards || "None"
            }\nBox Office: ${recommendation.boxOffice || "N/A"}    DVD: ${
              recommendation.DVD || "N/A"
            }    Website: ${recommendation.website || "N/A"}`}
            position="0 -0.5 0"
            align="left"
            color="#FF6B6B"
            width={textContentWidth * 0.7}
            wrap-count="80"
            line-height="45"
            font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
          ></a-text>
        </a-entity>
      </a-entity>
    </a-entity>
  );
};

export default MovieCardVR;
