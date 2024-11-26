// import GitHub from '@auth/core/providers/github';
import { defineConfig } from 'auth-astro';
import { db, eq, User } from 'astro:db';
import type { AdapterUser } from '@auth/core/adapters';
import bcrypt from 'bcryptjs'
import Credentials from '@auth/core/providers/credentials';
import Google from '@auth/core/providers/google';


export default defineConfig({
    providers: [

        // TODO:
        // GitHub({
        //     clientId: import.meta.env.GITHUB_CLIENT_ID,
        //     clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
        // }),

        Google({
            clientId: import.meta.env.AUTH_GOOGLE_ID,
            clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
        }),

        Credentials({
            credentials: {
                email: { label: 'Correo', type: 'email'},
                password: { label: 'Contraseña', type: 'password'},
            },
            authorize: async({ email, password }) => {

                const [user] = await db.select().from(User).where( eq(User.email, `${email}`) ) // as string to

                if ( !user ) {
                    throw new Error('User no found.')
                }
                
                if ( !bcrypt.compareSync(password as string, user.password) ) {
                    throw new Error('User no found.')
                }
                    
                const { password: _, ...rest } = user; 

                return rest;
            }
        }),
    ],

    callbacks: {

        jwt: ({ token, user }) => {
            if( user ) {
                token.user = user;
            }
            return token;
        },

        session: ({ session, token }) => {
            session.user = token.user as AdapterUser;
            return session;
        }
    }

});