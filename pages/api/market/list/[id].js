import axios from "axios";
import axiosRateLimit from "axios-rate-limit";
const http = axiosRateLimit(axios.create(), { maxRequests: 120, perMilliseconds: 60000 });
const { API } = require("@/config/config");

export default async function handler(req, res) {
	const { price, minOffer, type } = req.body.data;
	const { jwt } = req.headers;
	const { id } = req.query;
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	try {
		const listItem = async (jwt, id, price, minOffer, type) => {
			return http(`${API}/market/list?categoryId=1`, {
				method: "POST",
				headers: {
					"x-user-jwt": jwt,
				},
				data: {
					id: id,
					price: price,
					minOffer: minOffer,
					type: type,
				},
			});
		};
		const { data } = await listItem(jwt, id, price, minOffer, type);
		res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(err.response.status).json(err.response.data);
	}
}
