import useSWRV, { IConfig } from "swrv";
import { IResponse } from "swrv/dist/types";
import { computed, ref } from "@vue/composition-api";

type Options<T extends (option: any) => Promise<any>> = Parameters<
  Parameters<T> extends [Parameters<T>[0]]
    ? (
        option: Parameters<T>[0] &
          IConfig & {
            enabled?: boolean;
          }
      ) => void
    : (
        option?: Parameters<T>[0] &
          IConfig & {
            enabled?: boolean;
          }
      ) => void
>;

type Res<T extends (option: any) => Promise<any>> = IResponse<
  ReturnType<T> extends Promise<infer S> ? S : never,
  any
>;

function useMyAspidaSWRV<
  T extends Record<string, any> & {
    $get: (option: any) => Promise<any>;
    $path: (option?: any) => string;
  }
>(api: T, ...option: Options<T["$get"]>): Res<T["$get"]>;
function useMyAspidaSWRV<
  T extends Record<string, any> & { $path: (option?: any) => string },
  U extends {
    [K in keyof T]: T[K] extends (option: any) => Promise<any> ? K : never;
  }[keyof T]
>(api: T, key: U, ...option: Options<T[U]>): Res<T[U]>;
function useMyAspidaSWRV<
  T extends Record<string, any> & { $path: (option?: any) => string },
  U extends {
    [K in keyof T]: T[K] extends (option: any) => Promise<any> ? K : never;
  }[keyof T]
>(api: T, key: U, ...option: Parameters<T[U]>) {
  const method = typeof key === "string" ? key : "$get";
  const opt = typeof key === "string" ? (option as any)[0] : key;

  const enabled =
    typeof opt?.enabled === "object" ? opt.enabled.value : ref(!opt?.enabled);

  return useSWRV(
    // ここの判定を修正したりすると治るか？
    () => (enabled.value ? null : api.$path(opt)),
    () => api[method](opt),
    opt
  );
}

export default useMyAspidaSWRV;
