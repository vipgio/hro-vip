import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { planId } = req.query;
	const payload = req.body.data;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const doCraft = async (jwt, planId, payload) => {
			return http(`${API}/crafting/plans/${planId}?categoryId=1`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
				data: payload,
			});
		};
		const { data } = await doCraft(jwt, planId, payload);
		res.status(200).json(data);
	} catch (err) {
		// console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
