import { FC, Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SignincoverProps {}

const Signincover: FC<SignincoverProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [emptyFields, setEmptyFields] = useState({
    email: false,
    password: false
  });

  const [passwordShow, setpasswordShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        try {
          // Валидация на token-а със сървъра
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ token })
            }
          );

          if (!response.ok) {
            throw new Error("Token validation failed");
          }

          const result = await response.json();

          if (result.valid) {
            navigate(`${import.meta.env.BASE_URL}app/recommendations`);
          } else {
            console.log("Invalid token");
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            navigate("/signin");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          navigate("/signin");
        }
      } else {
        navigate("/signin");
      }
    };

    checkTokenValidity();
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвратяване на презареждането на страницата

    // Проверка дали полетата за имейл и парола са празни
    const emptyEmail = !formData.email;
    const emptyPassword = !formData.password;

    if (emptyEmail || emptyPassword) {
      // Запазване на състоянието за празните полета
      setEmptyFields({
        email: emptyEmail,
        password: emptyPassword
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

    try {
      // Изпращане на заявка за вход в системата
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...formData, rememberMe }) // Изпращане на данните за вход
        }
      );

      if (!response.ok) {
        // Ако отговорът не е успешен, обработване на грешката
        const errorData = await response.json();
        throw new Error(errorData.error || "Нещо се обърка! :(");
      }

      // Ако заявката е успешна, извличане на данните от отговора
      const data = await response.json();
      console.log("response: ", data);

      // Показване на съобщение за успешно влизане
      setAlerts([
        {
          message: "Успешно влизане!",
          color: "success",
          icon: <i className="ri-check-line"></i>
        }
      ]);

      // Запазване на токена в localStorage или sessionStorage в зависимост от избора на потребителя
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }

      // Пренасочване към страницата с препоръки
      navigate(`${import.meta.env.BASE_URL}app/recommendations`);
    } catch (error: any) {
      // Обработка на грешката и показване на съобщение за неуспешен вход
      setAlerts([
        {
          message: error.message,
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
    }
  };

  return (
    <Fragment>
      {/* Контейнер с центрирано съдържание */}
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
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
                  Имате профил?
                </p>
                {/* Подзаглавие */}
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal text-center">
                  Попълнете Вашите имейл и парола, за да влезете в профила си!
                </p>

                {/* Известия за грешки или успех */}
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
                    {/* Икона за известие */}
                    <div
                      style={{
                        marginRight: "0.5rem",
                        fontSize: "1.25rem",
                        lineHeight: "1"
                      }}
                    >
                      {alert.icon}
                    </div>
                    {/* Текст на известието */}
                    <div style={{ lineHeight: "1.2" }}>
                      <b>{alert.message}</b>
                    </div>
                  </div>
                ))}

                {/* Формуляр за въвеждане на данни */}
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-12 gap-y-4">
                    {/* Поле за имейл */}
                    <div className="xl:col-span-12 col-span-12">
                      <label
                        htmlFor="signin-email"
                        className="form-label text-default goodTiming"
                      >
                        Имейл
                      </label>
                      <input
                        type="email"
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
                        htmlFor="signin-password"
                        className="form-label text-default block goodTiming"
                      >
                        Парола
                        {/* Линк за забравена парола */}
                        <Link
                          to={`${import.meta.env.BASE_URL}resetpassword`}
                          className="ltr:float-right rtl:float-left text-danger font-GoodTiming"
                        >
                          Забравена парола
                        </Link>
                      </label>
                      <div className="input-group">
                        <input
                          type={passwordShow ? "text" : "password"}
                          className={`form-control form-control-lg !rounded-e-none ${
                            emptyFields.password ? "empty-field" : ""
                          }`}
                          id="password"
                          placeholder="Въведете своята парола"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        {/* Бутон за показване или скриване на паролата */}
                        <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                          onClick={() => setpasswordShow(!passwordShow)}
                          id="button-addon2"
                        >
                          <i
                            className={`${
                              passwordShow ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </button>
                      </div>

                      {/* Запомни паролата */}
                      <div className="mt-2">
                        <div className="form-check !ps-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                            htmlFor="rememberMe"
                          >
                            Запомни паролата ми
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Бутон за вход */}
                    <div className="xl:col-span-12 col-span-12 grid">
                      <button
                        type="submit"
                        className="ti-btn ti-btn-lg bg-primary text-white !text-lg goodTiming !font-medium dark:border-defaultborder/10"
                      >
                        Влезте
                      </button>
                    </div>
                  </div>
                </form>

                {/* Линк за създаване на нов профил */}
                <div className="text-center">
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                    Нямате профил?{" "}
                    <Link
                      to={`${import.meta.env.BASE_URL}signup`}
                      className="text-primary"
                    >
                      Създайте такъв сега!
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Signincover;
