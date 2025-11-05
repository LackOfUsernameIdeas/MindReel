import { FC, Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";

interface SignupcoverProps {}

const Signupcover: FC<SignupcoverProps> = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [emptyFields, setEmptyFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [passwordshow1, setpasswordshow1] = useState(false);
  const [passwordshow2, setpasswordshow2] = useState(false);

  const [isInfoboxOpen, setIsInfoboxOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      navigate(`${import.meta.env.BASE_URL}app/recommendations`);
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    setEmptyFields((prevState) => ({
      ...prevState,
      [id]: false
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвратяване на презареждането на страницата при изпращане на формата

    // Проверка дали някое от полетата е празно
    const emptyFirstName = !formData.firstName;
    const emptyLastName = !formData.lastName;
    const emptyEmail = !formData.email;
    const emptyPassword = !formData.password;
    const emptyConfirmPassword = !formData.confirmPassword;

    if (
      emptyFirstName ||
      emptyLastName ||
      emptyEmail ||
      emptyPassword ||
      emptyConfirmPassword
    ) {
      // Запазване на състоянието за празните полета
      setEmptyFields({
        firstName: emptyFirstName,
        lastName: emptyLastName,
        email: emptyEmail,
        password: emptyPassword,
        confirmPassword: emptyConfirmPassword
      });

      // Показване на предупреждение, че всички полета са задължителни
      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Проверка за валиден формат на имейла
    if (!EmailValidator.validate(formData.email)) {
      setAlerts([
        {
          message: "Невалиден формат на имейл адреса.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Проверка дали паролите съвпадат
    if (formData.password !== formData.confirmPassword) {
      setAlerts([
        {
          message: "Паролите не съвпадат!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Проверка за сила на паролата - трябва да съдържа малки и главни букви, цифри и специален символ, и да е поне 8 символа
    const passwordStrengthRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordStrengthRegex.test(formData.password)) {
      setAlerts([
        {
          message:
            "Паролата трябва да е дълга поне 8 знака и да включва комбинация от главни букви, малки букви, цифри и поне 1 специален символ.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      return;
    }

    // Показване на съобщение за изчакване при изпращане на заявката
    setAlerts([
      {
        message: "Моля, изчакайте...",
        color: "warning",
        icon: <i className="ri-error-warning-fill"></i>
      }
    ]);

    try {
      // Изпращане на заявка за регистрация
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        // Ако отговорът не е успешен, обработване на грешката
        const errorData = await response.json();
        throw new Error(errorData.error || "Нещо се обърка! :(");
      }

      // При успешна регистрация, пренасочване към страницата за двустепенна верификация
      navigate(`${import.meta.env.BASE_URL}twostepverification`, {
        state: { email: formData.email }
      });
    } catch (error: any) {
      let errorMessage = "";

      // Обработка на специфични грешки, като например дублиране на имейл
      switch (true) {
        case error.message.includes("Duplicate entry"):
          errorMessage = "Потребител с този имейл адрес вече съществува!";
          break;
        default:
          errorMessage = error.message;
          break;
      }

      // Показване на съобщение за грешка
      setAlerts([
        {
          message: errorMessage,
          color: "danger",
          icon: <i className="ri-error-warning-fill"></i>
        }
      ]);
    }
  };

  return (
    <Fragment>
      {/* Контейнер с центрирано съдържание */}
      <div className="container">
        <div className="flex justify-center items-center authentication authentication-basic h-full text-defaultsize text-defaulttextcolor">
          {/* Колона за съдържание */}
          <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
            {/* Линк за връщане към началната страница */}
            <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 m-4">
              <Link to={`${import.meta.env.BASE_URL}`}>
                {"<< Обратно към главната страница"}
              </Link>
            </p>

            {/* Контейнер за формата */}
            <div className="box">
              <div className="box-body !px-[3rem] !py-[2rem]">
                {/* Заглавие */}
                <p className="h5 font-semibold goodTiming mb-2 text-center">
                  Създаване на профил
                </p>
                {/* Подзаглавие */}
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal text-center">
                  Присъединете се към Лента на ума (MindReel) и създайте профил!
                </p>

                {/* Известия за грешки или успех */}
                <div className="form-wrapper max-w-lg mx-auto">
                  {alerts.map((alert, idx) => (
                    <div
                      className={`alert alert-${alert.color} flex items-center`}
                      role="alert"
                      key={idx}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginBottom: "1rem",
                        wordBreak: "break-word",
                        padding: "0.75rem 1rem",
                        minHeight: "auto",
                        alignItems: "center"
                      }}
                    >
                      <div
                        style={{
                          marginRight: "0.5rem",
                          fontSize: "1.25rem",
                          lineHeight: "1"
                        }}
                      >
                        {alert.icon}
                      </div>
                      <div style={{ lineHeight: "1.2" }}>
                        <b>{alert.message}</b>
                      </div>
                    </div>
                  ))}

                  {/* Формуляр за въвеждане на данни */}
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-12 gap-y-4">
                      {/* Поле за име */}
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-firstname"
                          className="form-label text-default goodTiming"
                        >
                          Име
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.firstName ? "empty-field" : ""
                          }`}
                          id="firstName"
                          placeholder="Въведете своето първо име"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </div>

                      {/* Поле за фамилия */}
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-lastname"
                          className="form-label text-default goodTiming"
                        >
                          Фамилия
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.lastName ? "empty-field" : ""
                          }`}
                          id="lastName"
                          placeholder="Въведете своята фамилия"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Поле за имейл */}
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-email"
                          className="form-label text-default goodTiming"
                        >
                          Имейл
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg w-full !rounded-md ${
                            emptyFields.email ? "empty-field" : ""
                          }`}
                          id="email"
                          placeholder="Въведете своя имейл"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Поле за парола */}
                      <div className="xl:col-span-12 col-span-12">
                        <label
                          htmlFor="signup-password"
                          className="form-label text-default goodTiming"
                        >
                          Парола
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordshow1 ? "text" : "password"}
                            className={`form-control form-control-lg w-full !rounded-e-none ${
                              emptyFields.password ? "empty-field" : ""
                            }`}
                            id="password"
                            placeholder="Въведете парола от поне 8 знака"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button
                            aria-label="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            onClick={() => setpasswordshow1(!passwordshow1)}
                            type="button"
                            id="button-addon2"
                          >
                            <i
                              className={`${
                                passwordshow1
                                  ? "ri-eye-line"
                                  : "ri-eye-off-line"
                              } align-middle`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Поле за потвърждаване на парола */}
                      <div className="xl:col-span-12 col-span-12 mb-4">
                        <label
                          htmlFor="signup-confirmpassword"
                          className="form-label text-default goodTiming"
                        >
                          Потвърждаване на паролата
                        </label>
                        <div className="input-group">
                          <input
                            type={passwordshow2 ? "text" : "password"}
                            className={`form-control form-control-lg w-full !rounded-e-none ${
                              emptyFields.confirmPassword ? "empty-field" : ""
                            }`}
                            id="confirmPassword"
                            placeholder="Повторете своята парола"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                          <button
                            aria-label="button"
                            className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                            onClick={() => setpasswordshow2(!passwordshow2)}
                            type="button"
                            id="button-addon21"
                          >
                            <i
                              className={`${
                                passwordshow2
                                  ? "ri-eye-line"
                                  : "ri-eye-off-line"
                              } align-middle`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Чекбокс за условия */}
                      <div className="xl:col-span-12 col-span-12 flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={isTermsAccepted}
                          onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                          className="accent-indigo-600"
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="underline text-defaulttextcolor dark:text-defaulttextcolor/70 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsInfoboxOpen(true);
                          }}
                        >
                          Потвърждавам, че съм запознат и съгласен с условията
                          за поверителност.
                        </label>
                      </div>

                      {/* Бутон за създаване на профил */}
                      <div className="xl:col-span-12 col-span-12 grid mt-2">
                        <button
                          type="submit"
                          className="ti-btn ti-btn-lg bg-primary text-white !text-lg goodTiming !font-medium dark:border-defaultborder/10"
                        >
                          Създай профил
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Линк за вход с вече съществуващ профил */}
                <div className="text-center">
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                    Вече имате профил?{" "}
                    <Link
                      to={`${import.meta.env.BASE_URL}signin/`}
                      className="text-primary"
                    >
                      Влезте в профила си!
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модал за условията за поверителност */}
      <InfoboxModal
        isModalOpen={isInfoboxOpen}
        onClick={() => setIsInfoboxOpen(false)}
        title="Условия за Лента на ума (MindReel)"
        description={
          <>
            <h3>Последна актуализация: 01/11/2025</h3>
            <p>
              MindReel е лицензиран на Вас (Краен потребител) за ползване само в
              съответствие с условията на това Споразумение за лиценз.
            </p>
            <p>
              Чрез достъпа до уеб приложението MindReel, Вие потвърждавате, че
              сте съгласни да бъдете обвързани от всички условия и разпоредби на
              това Споразумение за лиценз и че приемате това Споразумение за
              лиценз.
            </p>
            <p>
              Лицензодателят е единствено отговорен за уеб приложението MindReel
              и съдържанието му.
            </p>
            <p>
              MindReel е уеб приложение, което позволява на потребителите да
              въвеждат информация, свързана с техните артистични интереси,
              предпочитания, оценки или препоръки, за да получават
              персонализирани предложения и насоки в областта на изкуството.
            </p>
            <h4>1. ОБХВАТ НА ЛИЦЕНЗА</h4>
            <ul>
              <li>
                1.1 Вие получавате непрехвърляем, неконкурентен,
                несублицензируем лиценз да използвате уеб приложението MindReel
                за лична, некомерсиална употреба.
              </li>
              <li>
                1.2 Вие не можете да споделяте или да правите уеб приложението
                достъпно за трети страни, да продавате, наемате, заемате, давате
                под наем или по друг начин да разпределяте уеб приложението.
              </li>
              <li>
                1.3 Вие не можете да извършвате обратен инженеринг,
                декомпилиране или да се опитвате да възстановите изходния код на
                уеб приложението или неговите компоненти.
              </li>
            </ul>
            <h4>2. ПОВЕРИТЕЛНОСТ И СИГУРНОСТ НА ДАННИТЕ</h4>
            <ul>
              <li>
                2.1 MindReel събира и съхранява лични данни, като име, имейл
                адрес, артистични интереси, предпочитания и друга доброволно
                предоставена информация с цел осигуряване на персонализирани
                препоръки, съдържание и услуги.
              </li>
              <li>
                2.2 Данните се използват единствено с цел подобряване на Вашето
                преживяване в платформата и няма да бъдат разкривани на трети
                страни без Вашето изрично съгласие.
              </li>
              <li>
                2.3 MindReel предприема подходящи технически и организационни
                мерки за защита на личните данни от неоторизиран достъп,
                изменение, разкриване или унищожаване.
              </li>
              <li>
                2.4 Вие имате право да поискате достъп до, коригиране или
                изтриване на своите лични данни.
              </li>
            </ul>
            <h4>3. ОГРАНИЧЕНИЕ НА ОТГОВОРНОСТТА</h4>
            <ul>
              <li>
                3.1 До максималната степен, разрешена от приложимото право,
                Лицензодателят не носи отговорност за каквито и да е специални,
                инцидентни, косвени или последващи щети, произтичащи от или
                свързани с използването или невъзможността за използване на уеб
                приложението MindReel.
              </li>
            </ul>
            <h4>4. ПРИЛОЖИМО ПРАВО</h4>
            <ul>
              <li>
                4.1 Това Споразумение за лиценз се регулира и тълкува в
                съответствие със законите на Република България.
              </li>
            </ul>
            <h4>5. МОДИФИКАЦИИ НА СПОРАЗУМЕНИЕТО</h4>
            <ul>
              <li>
                5.1 Лицензодателят си запазва правото да изменя или актуализира
                условията на това Споразумение по всяко време.
              </li>
              <li>
                5.2 В случай на съществени промени, потребителите ще бъдат
                уведомени предварително.
              </li>
              <li>
                5.3 Продължаващото използване на уеб приложението MindReel след
                такива изменения ще се счита за приемане на новите условия.
              </li>
            </ul>
            <h4>6. ИНФОРМАЦИЯ ЗА КОНТАКТ</h4>
            <ul>
              <li>
                6.1 За всякакви въпроси, свързани с настоящото Споразумение,
                моля, свържете се с нас на: 📧 cinecompass52@gmail.com
              </li>
            </ul>
          </>
        }
      />
    </Fragment>
  );
};

export default Signupcover;
