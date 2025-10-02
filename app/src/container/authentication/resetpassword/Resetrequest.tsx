import { FC, Fragment, useState } from "react";
import { Link } from "react-router-dom";
import * as EmailValidator from "email-validator";

interface ResetRequestProps {}

const ResetRequest: FC<ResetRequestProps> = () => {
  const [email, setEmail] = useState("");
  const [alerts, setAlerts] = useState<
    { message: string; color: string; icon: JSX.Element }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordResetRequest = async () => {
    setIsSubmitting(true);

    if (email == "") {
      setAlerts([
        {
          message: "Всички полета са задължителни!",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    if (!EmailValidator.validate(email)) {
      setAlerts([
        {
          message: "Невалиден формат на имейл адреса.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/password-reset-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result);

        setAlerts([
          {
            message: "Изпратихме Ви линк за смяна на паролата успешно!",
            color: "success",
            icon: <i className="ri-check-line"></i>
          }
        ]);
      } else {
        setAlerts([
          {
            message:
              result.error || "Не успяхме да изпратим имейл. Опитайте отново.",
            color: "danger",
            icon: <i className="ri-error-warning-line"></i>
          }
        ]);
      }
    } catch (error) {
      setAlerts([
        {
          message: "Не успяхме да изпратим имейл. Опитайте отново.",
          color: "danger",
          icon: <i className="ri-error-warning-line"></i>
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      {/* Контейнер с центрирано съдържание */}
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          {/* Колона за съдържание */}
          <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
            {/* Контейнер за формата */}
            <div className="box">
              <div className="box-body !px-[3rem] !py-[2rem]">
                {/* Заглавие */}
                <p className="h5 font-semibold goodTiming mb-2 text-center">
                  Забравили сте паролата си?
                </p>
                {/* Подзаглавие */}
                <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal text-center">
                  Въведете своя имейл тук и ако имате профил с него, ще получите
                  линк за смяна на паролата.
                </p>

                {/* Формата за въвеждане на имейл с известия за грешки или успех */}
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

                  <div className="grid grid-cols-12 gap-y-4">
                    {/* Поле за имейл */}
                    <div className="xl:col-span-12 col-span-12">
                      <label
                        htmlFor="reset-email"
                        className="form-label text-default goodTiming"
                      >
                        Имейл
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg w-full !rounded-md"
                        id="reset-email"
                        placeholder="Въведете своя имейл адрес"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* Бутон за изпращане на заявка за смяна на парола */}
                    <div className="xl:col-span-12 col-span-12 grid mt-2">
                      <button
                        className="ti-btn ti-btn-lg bg-primary text-white !text-lg goodTiming !font-medium dark:border-defaultborder/10"
                        onClick={handlePasswordResetRequest}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Изпращаме имейл..."
                          : "Създай нова парола"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Линк за връщане към формата за влизане */}
                <div className="text-center">
                  <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                    Объркахте нещо?{" "}
                    <Link
                      to={`${import.meta.env.BASE_URL}signin/`}
                      className="text-primary"
                    >
                      Върнете се към формата за влизане
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

export default ResetRequest;
