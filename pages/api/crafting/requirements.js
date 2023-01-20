import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { planId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getPlans = async (jwt, planId) => {
			return http(`${API}/crafting/plans/${planId}/requirements?categoryId=1`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getPlans(jwt, planId);
		res.status(200).json(data);
	} catch (err) {
		// console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
