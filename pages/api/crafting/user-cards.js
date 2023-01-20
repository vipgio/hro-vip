import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { templateId } = req.query;
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	try {
		const getCards = async (jwt, templateId) => {
			return http(`${API}/crafting/user-cards/${templateId}?categoryId=1`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-user-jwt": jwt,
				},
			});
		};
		const { data } = await getCards(jwt, templateId);
		res.status(200).json(data);
	} catch (err) {
		// console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
