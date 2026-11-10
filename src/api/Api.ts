/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_create_construction_work */
export interface BodyCreateConstructionWork {
  /**
   * Work Name
   * @minLength 1
   * @maxLength 100
   */
  work_name: string;
  /** Image */
  image: File | Blob;
  /** Video */
  video: File | Blob;
}

/** ConstructionWorkOut */
export interface ConstructionWorkOut {
  /** Id */
  id: number;
  /** Work Name */
  work_name: string;
  /** Work Description */
  work_description: string | null;
  /** Work Status */
  work_status: string;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
  /** Historical Price */
  historical_price: number | null;
  /** Base Year */
  base_year: number | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Formed At */
  formed_at: string | null;
  /** Likes Count */
  likes_count: number;
  /** Is Mine */
  is_mine: number;
  /** Is Liked */
  is_liked: number;
}

/** ConstructionWorkPublish */
export interface ConstructionWorkPublish {
  /**
   * Work Description
   * @minLength 1
   * @maxLength 500
   */
  work_description: string;
  /**
   * Historical Price
   * @exclusiveMin 0
   */
  historical_price: number;
  /**
   * Base Year
   * @min 1000
   * @max 2100
   */
  base_year: number;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** UserLogin */
export interface UserLogin {
  /** User Login */
  user_login: string;
  /** Password */
  password: string;
}

/** UserOut */
export interface UserOut {
  /** Id */
  id: number;
  /** User Login */
  user_login: string;
}

/** UserRegister */
export interface UserRegister {
  /**
   * User Login
   * @minLength 3
   * @maxLength 50
   */
  user_login: string;
  /**
   * Password
   * @minLength 6
   * @maxLength 100
   */
  password: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

/** WorkLikeIn */
export interface WorkLikeIn {
  /**
   * Like
   * @min 0
   * @max 1
   */
  like: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Справочник строительных работ
 * @version 0.1.0
 *
 * Сессионная аутентификация через куку sessionId, сессии хранятся в Redis. Без входа доступны только GET списка и ленты. Для методов создателя выполните POST /api/users/login: браузер сохранит куку и будет отправлять её сам.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  constructionWorks = {
    /**
     * @description Опубликованные работы, фильтр по максимальной цене в копейках. Доступен гостю. is_mine = 1, если работу создал вошедший пользователь, у гостя всегда 0.
     *
     * @tags Строительные работы
     * @name GetConstructionWorks
     * @summary Список работ с фильтром
     * @request GET:/api/construction-works
     */
    getConstructionWorks: (
      query?: {
        /** Max Historical Price */
        max_historical_price?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConstructionWorkOut[], HTTPValidationError>({
        path: `/api/construction-works`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик, создатель берётся из сессии. Файлы сохраняются в MinIO, в БД ссылки. 401 - не выполнен вход, 400 - черновик уже есть или файл не того типа.
     *
     * @tags Строительные работы
     * @name CreateConstructionWork
     * @summary Добавление работы с фото и видео
     * @request POST:/api/construction-works
     * @secure
     */
    createConstructionWork: (
      data: BodyCreateConstructionWork,
      params: RequestParams = {},
    ) =>
      this.request<ConstructionWorkOut, HTTPValidationError>({
        path: `/api/construction-works`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Одна опубликованная работа. Без параметров - первая, с work_id - эта, с work_id и next=true - следующая. Доступна гостю. is_liked = 1, если вошедший пользователь лайкнул работу, у гостя всегда 0.
     *
     * @tags Строительные работы
     * @name GetConstructionWorkFeed
     * @summary Лента
     * @request GET:/api/construction-works/feed
     */
    getConstructionWorkFeed: (
      query?: {
        /**
         * Work Id
         * @default 0
         */
        work_id?: number;
        /**
         * Next
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConstructionWorkOut, HTTPValidationError>({
        path: `/api/construction-works/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Черновик вошедшего пользователя, id не указывается. 401 - не выполнен вход, 404 - черновика нет.
     *
     * @tags Строительные работы
     * @name GetConstructionWorkDraft
     * @summary Черновик
     * @request GET:/api/construction-works/draft
     * @secure
     */
    getConstructionWorkDraft: (params: RequestParams = {}) =>
      this.request<ConstructionWorkOut, any>({
        path: `/api/construction-works/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Заполняет описание, цену и год, меняет статус на опубликован и ставит дату публикации. 401 - не выполнен вход, 404 - черновика нет.
     *
     * @tags Строительные работы
     * @name PublishConstructionWork
     * @summary Публикация черновика
     * @request PUT:/api/construction-works/draft/publish
     * @secure
     */
    publishConstructionWork: (
      data: ConstructionWorkPublish,
      params: RequestParams = {},
    ) =>
      this.request<ConstructionWorkOut, HTTPValidationError>({
        path: `/api/construction-works/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Мягкое удаление: статус удален. 401 - не выполнен вход, 403 - чужая работа, 404 - работы нет.
     *
     * @tags Строительные работы
     * @name DeleteConstructionWork
     * @summary Удаление работы
     * @request DELETE:/api/construction-works/{work_id}
     * @secure
     */
    deleteConstructionWork: (workId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/api/construction-works/${workId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description like = 1 ставит лайк, like = 0 снимает. 401 - не выполнен вход, 404 - работа не опубликована.
     *
     * @tags Строительные работы
     * @name LikeConstructionWork
     * @summary Лайк
     * @request POST:/api/construction-works/{work_id}/like
     * @secure
     */
    likeConstructionWork: (
      workId: number,
      data: WorkLikeIn,
      params: RequestParams = {},
    ) =>
      this.request<ConstructionWorkOut, HTTPValidationError>({
        path: `/api/construction-works/${workId}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создаёт пользователя. Пароль хранится как хеш SHA-256. 409 - логин занят.
     *
     * @tags Пользователи
     * @name RegisterUser
     * @summary Регистрация
     * @request POST:/api/users/register
     */
    registerUser: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserOut, HTTPValidationError>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль, создаёт сессию в Redis на 1 час и ставит куку sessionId (HttpOnly). Дальше браузер сам отправляет куку в каждом запросе. 401 - неверный логин или пароль.
     *
     * @tags Пользователи
     * @name LoginUser
     * @summary Аутентификация
     * @request POST:/api/users/login
     */
    loginUser: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserOut, HTTPValidationError>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и куку sessionId. После этого кука больше не действует.
     *
     * @tags Пользователи
     * @name LogoutUser
     * @summary Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
