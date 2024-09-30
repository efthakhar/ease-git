import { defineStore } from 'pinia';


export const useUiStore = defineStore('ui', {

    state: () => {
        return {
            sidebarCollapsed: false,
            login: false,
            routeLoading: false,
            theme: 'light',
            githubUsername: '',
            githubUserAvatar: '',
            githubToken: '',
            toasts: [
                {
                    'type': 'danger',
                    'message': 'Validation Failed',
                }
            ]
        }
    },

    actions: {

        retrieveSavedData() {
            this.setTheme(localStorage.getItem('theme') ?? 'light');
            this.setGithubUsername(localStorage.getItem('githubUsername') ?? '');
            this.setGithubToken(localStorage.getItem('githubToken') ?? '');
            this.setLogin(JSON.parse(localStorage.getItem('login')) || false);
            this.setSidebarCollpased(JSON.parse(localStorage.getItem('sidebarCollapsed')) || false);
        },

        async logIn() {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch('https://api.github.com/user', {
                        headers: {
                            'Authorization': `token ${this.githubToken}`,
                            'Accept': 'application/vnd.github.v3+json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        this.setLogin(true);
                        this.setGithubToken(this.githubToken);
                        this.setGithubUsername(data.login);
                        resolve(data); 
                    } else {
                        throw new Error('Invalid token provided');
                    }
                } catch (error) {
                    this.setLogin(false);
                    reject(error); 
                }
            });
        },


        setSidebarCollpased(collapsedStatus) {
            this.sidebarCollapsed = collapsedStatus;
            localStorage.setItem('sidebarCollapsed', collapsedStatus);
        },

        setLogin(status) {
            this.login = status;
            localStorage.setItem('login', status);
            status == false ? this.githubToken = '' : '';
        },

        setTheme(themeName) {
            this.theme = themeName;
            document.body.setAttribute('data-bs-theme', this.theme == 'light' ? 'light' : 'dark');
            localStorage.setItem('theme', themeName);
        },

        setGithubToken(token) {
            this.githubToken = token;
            localStorage.setItem('githubToken', token);
        },

        setGithubUsername(userName) {
            this.githubUsername = userName;
            localStorage.setItem('githubUsername', userName);
        },

       

        setRouteLoading(status) {
            this.routeLoading = status;
        },
    },
})