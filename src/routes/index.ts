import * as express from "express";
import * as passport from "passport";
import { getConnection } from "typeorm";
import { Strategy } from "passport-twitter";

import { confirmEmail } from "./confirmEmail";
import { User } from "../entity/User";

const Router = express.Router();

passport.use(
	new Strategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
			callbackURL: "http://localhost:4000/auth/twitter/callback",
			includeEmail: true
		},
		async (_, __, profile, cb) => {
			const connection = await getConnection();
			const { id, emails } = profile;
			console.log(id, emails);

			const query = connection
				.getRepository(User)
				.createQueryBuilder("user")
				.where("user.twitterId = :id", { id });

			let email: string | null = "";

			if (emails) {
				email = emails[0].value;
				query.orWhere("user.email = :email", { email });
			}
			console.log(email);

			let user = await query.getOne();

			// This user needs to be registered
			if (!user) {
				user = await User.create({
					twitterId: id,
					email
				}).save();
			} else if (!user.twitterId) {
				// merge account
				// we found user by email
				user.twitterId = id;
				await user.save();
			} else {
				// we have a twitterId
				// login
			}

			return cb(null, { id: user.id });
		}
	)
);

Router.use(passport.initialize());

Router.get("/confirm/:id", confirmEmail)
	.get("/auth/twitter", passport.authenticate("twitter"))
	.get(
		"/auth/twitter/callback",
		passport.authenticate("twitter", { session: false }),
		(request, response) => {
			(request.session as any).userId = (request.user as any).id;
			// redirect to frontend
			// https://www.youtube.com/watch?v=fz5TJjU8mek&index=29&list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V
			response.redirect(`${process.env.FRONTEND_HOST}/some-page`);
		}
	);

export default Router;
