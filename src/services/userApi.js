import axios from "axios";
import { clearToken } from "../redux/userSlice";
import store from '../redux/store'
import { BASEURL } from "../constant/constants";
const userApiClient = axios.create({
	baseURL: `${BASEURL}`,
	headers: {
		"Content-Type": "application/json",
	},
});

userApiClient.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const accessToken = state.token.value;
        console.log(accessToken);
        
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

userApiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const originalRequest = error.config;

		if (error.response && error.response.status === 403) {
			const errorCode = error.response.data.code;

			if (errorCode === "ACCOUNT_INACTIVE") {
				store.dispatch(clearToken());
				return Promise.reject(
					new Error("Your account is inactive. Please contact support.")
				);
			} else if (errorCode === "NOT_VERIFIED") {
				return Promise.reject(
					new Error(
						"User is not verified. Please complete the verification process."
					)
				);
			}
		}
		if (error.response && error.response.status === 401) {
			store.dispatch(clearToken());
			return Promise.reject(
				new Error("Unauthorized. Please log in again.")
			);
		}

		return Promise.reject(error);
	}
);

export default userApiClient;
