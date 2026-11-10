import "./LoginPage.css";
import { useState, type FC, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { useAppDispatch } from "../store";
import { setUser } from "../slices/userSlice";
import { LoadingOverlay } from "../components/LoadingOverlay";

interface LoginResponse {
  id: number;
  user_login: string;
}

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post<LoginResponse>("/api/users/login", {
        user_login: userLogin,
        password,
      });
      dispatch(setUser(response.data.user_login));
      navigate(ROUTES.CATALOG);
    } catch (loginError) {
      const status = axios.isAxiosError(loginError) ? loginError.response?.status : undefined;
      setError(status === 401 ? "Неверный логин или пароль" : "Сервер недоступен");
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Вход сметчика</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Label className="loginLabel" htmlFor="user_login">
          Логин
        </Form.Label>
        <Form.Control
          id="user_login"
          className="loginField"
          type="text"
          autoComplete="username"
          required
          value={userLogin}
          onChange={(event) => setUserLogin(event.target.value)}
        />

        <Form.Label className="loginLabel" htmlFor="password">
          Пароль
        </Form.Label>
        <Form.Control
          id="password"
          className="loginField"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="loginError">{error}</p>}

        <Button className="loginSubmit" type="submit" disabled={loading}>
          Войти
        </Button>
      </Form>

      {loading && <LoadingOverlay />}
    </div>
  );
};
