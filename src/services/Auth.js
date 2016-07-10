export default {
    user: {
        authenticated: false,
        id: 0,
        email: ''
    },
    context: '',

    login (context, creds) {
        this.context = context;
        let self = this;

        context.session.call("user/login", {"creds": creds}).then(
            function (result) {
                console.log('Auth login success', result);

                context.showLoginModal = false;
                context.hideAuthError();

                self.setToken(result.token);
                self.getUserInfo(result.token);

                context.showLoginAndRegisterButtons = false;
            },
            function (error, desc) {
                console.log("Auth login error");

                context.showAuthError();
            }
        );
    },

    register (context, userInfo) {
        this.context = context;
        let self = this;

        console.log("Register user", userInfo);

        context.session.call("user/register", {"userInfo": userInfo}).then(
            function (result) {
                console.log("Auth register user", userInfo);

                context.showRegisterModal = false;
                context.hideRegisterError();

                self.setToken(result.token);
                self.getUserInfo(result.token);
            },
            function (error, desc) {
                console.log("Auth register user error", userInfo, error, desc);

                context.showRegisterError();
            }
        );
    },

    logout () {
        const token = this.getToken();

        console.log("Logout");

        if (this.user.authenticated && token) {
            this.user.authenticated = false;
            this.user.id = 0;
            this.user.email = '';

            localStorage.removeItem('auth-token');
        }
    },

    getUserInfo (token) {
        token = token || localStorage.getItem('auth-token');

        console.log("Get user info by token", token);

        if (!token) {
            return false;
        }

        let self = this;

        this.context.session.call("user/info", {"token": token}).then(
            function (result) {
                self.user.id = result.user.id;
                self.user.email = result.user.email;
                self.user.authenticated = true;

                console.log("Auth get user info success", self.user);
            },
            function (error, desc) {
                console.log("Auth get user info error");
            }
        );
    },

    checkAuth () {
        return this.user.authenticated;
    },

    getToken () {
        return localStorage.getItem('auth-token');
    },

    setToken (token) {
        console.log("Set token to localStorage", token);
        localStorage.setItem('auth-token', token);
    }
}
