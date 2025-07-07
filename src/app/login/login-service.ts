import { Injectable } from "@angular/core";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, User, getAuth, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    isWeb = false;
    firebase: any;
    loginResponse: any;
    refresh_Access_token: any;
    constructor() {
        this.firebase = initializeApp(environment.firebase);
    }

    public async logout() {
        await getAuth(this.firebase).signOut();
        this.refresh_Access_token = undefined;
        this.loginResponse = undefined;
        await SocialLogin.logout({ provider: 'google' }).then(() => console.log('Signed Out')).catch((e: any) => { console.log('Signed Out'); });
    }

    public async refreshToken() {
        const auth = getAuth(this.firebase);
        onAuthStateChanged(auth, async (currenUser: User | null) => {
            if (currenUser) {
                const idToken = await currenUser.getIdToken(true);
                console.log(idToken);
                this.refresh_Access_token = idToken;
            } else {
                this.logout();
            }
        });
    }

    async initialize() {
        await SocialLogin.initialize({
            google: {
                webClientId: '546503816779-b718ndsqumeaagad9bpn2oft3e81lglo.apps.googleusercontent.com',
                mode: 'online'
            }
        });
    }

    async loginViaGoogle() {
        const user: any = await SocialLogin.login({
            provider: 'google',
            options: {
                scopes: ['email', 'profile'],
                forceRefreshToken: true
            }
        });
        debugger
        if (user) {
            this.loginResponse = JSON.stringify(user.result, null, 2);
            console.log(this.loginResponse);
            const googleUser = await signInWithCredential(getAuth(this.firebase), GoogleAuthProvider.credential(user.result.idToken));
            this.refresh_Access_token = await googleUser.user.getIdToken();
        }
    }
}