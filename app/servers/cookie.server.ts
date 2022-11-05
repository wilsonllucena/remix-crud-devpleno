import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("auth-crud", {
    maxAge: 604_800
})

export const deleteCookie = createCookie("auth-crud", {
  maxAge: -604_800,
});