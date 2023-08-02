import dotEnv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
    const configFile = `./.env.${process.env.NODE_ENV}.local`
    dotEnv.config({path: configFile})
} else {
    dotEnv.config()
}

const index = {
    PORT: process.env.PORT
}

export const {
    PORT
} = index