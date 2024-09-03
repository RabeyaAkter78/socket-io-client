const { default: NextAuth } = require("next-auth/next");
const { default: authOptions } = require("../../../../../lib/authOptions");

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;


