import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { jwt } = req.headers;
	const { packId } = req.query;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const listItem = async (jwt, packId) => {
			return http(`${API}/packs/open2?categoryId=1`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					packId: packId,
				},
			});
		};
		const { data } = await listItem(jwt, packId);
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
