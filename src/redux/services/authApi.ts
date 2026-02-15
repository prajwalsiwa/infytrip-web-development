import { setAuth, setAuthStateResponse } from "../features/authSlice";
import { UserProfileResponse } from "../features/Types/auth";
import { setUserProfile } from "../features/userSlice";
import { rootApi } from "../root.api";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      setAuthStateResponse,
      { username: string; password: string }
    >({
      query: (credentials) => {
        const basicAuth = btoa(
          `${credentials.username}:${credentials.password}`,
        );
        return {
          url: "/auth/login/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
        };
      },

      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data));
        } catch (error) {
          console.error("Error login", error);
        }
      },
    }),
    refreshAuth: builder.mutation<setAuthStateResponse, { token: string }>({
      query: ({ token }) => ({
        url: "/auth/refresh/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data));
        } catch (error) {
          console.error("Refresh auth faild", error);
        }
      },
    }),
    authUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/user/profile/",
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserProfile(data));
        } catch (error) {
          console.error(" Error fetching User Profile", error);
        }
      },
    }),
    register: builder.mutation<
      {
        full_name: string;
        email: string;
        confirm_password: string;
        password: string;
      },
      {
        username: string;
        password: string;
        full_name: string;
        email: string;
        confirm_password: string;
      }
    >({
      query: (credentials) => {
        return {
          url: "auth/user/register/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            username: credentials.username,
            password: credentials.password,
            full_name: credentials.full_name,
            email: credentials.email,
            confirm_password: credentials.confirm_password,
          },
        };
      },
    }),
    googleAuth: builder.mutation<{ access: string }, { token: string }>({
      query: ({ token }) => ({
        url: "/auth/google/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { token },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          // Fake shape to satisfy setAuth() - expiry not used
          const googleAuthPayload: setAuthStateResponse = {
            token: data.access,
            expiry: "", // dummy value
            groups: { id: 2, name: "user" }, // default or static role
          };

          dispatch(setAuth(googleAuthPayload));
        } catch (error) {
          console.error("Google login failed", error);
        }
      },
    }),
    verifyEmail: builder.mutation<
      {
        email: string;
        otp: string;
      },
      {
        email: string;
        otp: string;
      }
    >({
      query: (credentials) => {
        return {
          url: "auth/otp/verify/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: credentials.email,
            otp: credentials.otp,
          },
        };
      },
    }),
    resendOtp: builder.mutation<
      {
        email: string;
      },
      {
        email: string;
      }
    >({
      query: (credentials) => {
        return {
          url: "auth/otp/resend/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: credentials.email,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshAuthMutation,
  useRegisterMutation,
  useLazyAuthUserProfileQuery,
  useGoogleAuthMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
} = authApi;
