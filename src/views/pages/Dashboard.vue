<script setup>
import { onMounted, ref } from 'vue';
import { useUiStore } from '../../stores/ui';

const uiStore = useUiStore();

const repos = ref([]);
const totalRepos = ref(0);
const gitUserDetails = ref({});

const since = ref('');
const until = ref('');
const selectedRepo = ref('');
const commits = ref([]);



async function getGitUserDetails(token) {

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            resolve(await response.json())
        } catch (error) {
            reject(error);
        }
    });


}

async function fetchAllRepos(token) {
    const url = `https://api.github.com/user/repos?per_page=100`;
    let allRepos = [];
    let page = 1;

    try {
        while (true) {
            const response = await fetch(`${url}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const repos = await response.json();
            if (repos.length === 0) {
                break;
            }

            allRepos = [...allRepos, ...repos];
            page++;
        }

        return allRepos;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

async function fetchRepoCommits(repo, since, until, token) {


    try {

        if(repos == '' || since == '' || until == '') {
            return '';
        }

        let owner = repos.value.find(item => item.name === repo).owner.login;

        const sinceISO = new Date(since).toISOString();
        const untilISO = new Date(until).toISOString();

        const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceISO}&until=${untilISO}`;


        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        commits.value = data;
        return data;
    } catch (error) {
        console.error('Error fetching commits for repo:', error);
        throw error;
    }
}



onMounted(() => {

    getGitUserDetails(uiStore.githubToken)
        .then((response) => {
            gitUserDetails.value = response;
        })

    fetchAllRepos(uiStore.githubToken)
        .then((response) => {
            repos.value = response;
            totalRepos.value = response.length;
            const since = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
            const until = new Date().toISOString();
            selectedRepo.value = response[0].name;
            fetchRepoCommits(response[0].name, since, until, uiStore.githubToken)
        });

});
</script>

<template>
    <div class="p-0 m-0">
        <div class="row mb-5">
            <div class="col-md-3 my-1">
                <div class="card rounded-0 border bg-light-subtle">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div>
                                <p class="mb-0 text-body">Public Repos</p>
                                <h4 class="my-1 text-info">{{ gitUserDetails.public_repos }}</h4>
                                <!-- <p class="mb-0 font-13">dsf</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 my-1">
                <div class="card rounded-0 border bg-light-subtle border">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div>
                                <p class="mb-0 text-body">Private Repos</p>
                                <h4 class="my-1 text-danger">{{ (totalRepos - parseFloat(gitUserDetails.public_repos))
                                    }}</h4>
                                <!-- <p class="mb-0 font-13">+5.4% from last week</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 my-1">
                <div class="card rounded-0 border bg-light-subtle border">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div>
                                <p class="mb-0 text-body">Total Followers</p>
                                <h4 class="my-1 text-success">{{ gitUserDetails.followers }}</h4>
                                <!-- <p class="mb-0 font-13">-4.5% from last week</p> -->
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 my-1">
                <div class="card rounded-0 border bg-light-subtle border">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div>
                                <p class="mb-0 text-body">Total Following</p>
                                <h4 class="my-1 text-warning">{{ gitUserDetails.following }}</h4>
                                <!-- <p class="mb-0 font-13">+8.4% from last week</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
         
            <div class="col-md-12 mb-1">
                <div class="d-flex">
                    <h4 class="h4 text-body">Commit List</h4>
                    <div class="actions ms-auto d-flex align-items-center">
                        <span class="mx-2">Repo</span>
                        <select class="form-control form-control-sm me-2" style="min-width: 200px;"
                            v-model="selectedRepo"
                            @change="fetchRepoCommits(selectedRepo, since, until, uiStore.githubToken)">
                            <option value="">Select Repo</option>
                            <option :value="item.name" v-for="item in repos" :key="item.name">{{ item.name }}</option>
                        </select>
                        <span class="me-1">From</span> <input type="date" class="form-control form-control-sm d-inline"
                            v-model="since"
                            @change="fetchRepoCommits(selectedRepo, since, until, uiStore.githubToken)">
                        <span class="me-1 ms-3">To</span>
                        <input type="date" v-model="until" class="form-control form-control-sm d-inline"
                            @change="fetchRepoCommits(selectedRepo, since, until, uiStore.githubToken)">
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <table class="table table-light-subtle table-bordered">
                    <thead>
                        <tr class="">
                            <th scope="col">Date</th>
                            <th scope="col">Commit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in commits">
                            <td>
                                {{
                                    new Date(item.commit.committer.date).toLocaleString('en-US', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })
                                        .replace(',', '')
                                        .replace('at', '')
                                }}
                            </td>
                            <td>
                                <a :href="item.html_url">
                                    {{ item.commit.message }}
                                </a>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
