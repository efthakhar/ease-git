<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useUiStore } from '../../stores/ui';

const uiStore = useUiStore();

const totalRepos = ref(0);
const totalCommitsLast7Day = ref(0);
const totalPrivateRepos = ref(0); // Track private repositories separately
const totalBranches = ref(0);
const totalStars = ref(0);
const totalFollowers = ref(0);
const totalFollowing = ref(0);

const USERNAME = uiStore.githubUsername;
const TOKEN = uiStore.githubToken;
const GITHUB_API = 'https://api.github.com';

const headers = {
    Authorization: `token ${TOKEN}`
};

// Function to fetch all repositories (with pagination)
async function fetchAllRepos() {
    let page = 1;
    let repos = [];
    let hasMoreRepos = true;

    while (hasMoreRepos) {
        const response = await fetch(`${GITHUB_API}/user/repos?per_page=100&page=${page}`, { headers });
        const data = await response.json();
        repos = repos.concat(data);
        if (data.length < 100) {
            hasMoreRepos = false;
        } else {
            page++;
        }
    }

    return repos;
}

// fetch commits for a repository in the last 7 days (with pagination)
async function fetchCommitsForRepo(repoFullName) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let page = 1;
    let commitCount = 0;
    let hasMoreCommits = true;

    while (hasMoreCommits) {
        const response = await fetch(`${GITHUB_API}/repos/${repoFullName}/commits?author=${USERNAME}&since=${sevenDaysAgo}&per_page=100&page=${page}`, { headers });
        const data = await response.json();
        commitCount += data.length;
        if (data.length < 100) {
            hasMoreCommits = false;
        } else {
            page++;
        }
    }

    return commitCount;
}

// get the total commit count in the last 7 days
async function getTotalCommitsLast7Days() {
    try {
        const repos = await fetchAllRepos();
        let totalCommits = 0;

        for (const repo of repos) {
            console.log(`Counting commits for ${repo.full_name}...`);
            const commitCount = await fetchCommitsForRepo(repo.full_name);
            totalCommits += commitCount;
        }
        totalCommitsLast7Day.value = totalCommits;
        console.log(`Total commits by ${USERNAME} in the last 7 days: ${totalCommits}`);

    } catch (error) {
        console.error('Error fetching commit data:', error);
    }
}

async function generateGitHubReport() {
    try {

        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${uiStore.githubToken}` // Fixed token format
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        totalFollowers.value = userData.followers;
        totalFollowing.value = userData.following;
        totalRepos.value = userData.public_repos;
        totalPrivateRepos.value = userData.total_private_repos;


        const reposResponse = await fetch('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${uiStore.githubToken}`
            }
        });

        if (!reposResponse.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await reposResponse.json();
        if (Array.isArray(repos)) {
            for (const repo of repos) {
                totalStars.value += repo.stargazers_count;
            }
            for (const repo of repos) {
                const branchesResponse = await fetch(`https://api.github.com/repos/${uiStore.githubUsername}/${repo.name}/branches`, {
                    headers: {
                        'Authorization': `token ${uiStore.githubToken}`
                    }
                });

                if (branchesResponse.ok) {
                    const branches = await branchesResponse.json();
                    if (Array.isArray(branches)) {
                        totalBranches.value += branches.length;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error generating GitHub report:', error);
    }
}

onMounted(() => {
    generateGitHubReport();
    getTotalCommitsLast7Days();
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
                                <p class="mb-0 text-body">Total Public Repos</p>
                                <h4 class="my-1 text-info">{{ totalRepos }}</h4>
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
                                <p class="mb-0 text-body">Total Commit in Week</p>
                                <h4 class="my-1 text-danger">{{ totalCommitsLast7Day }}</h4>
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
                                <h4 class="my-1 text-success">{{ totalFollowers }}</h4>
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
                                <h4 class="my-1 text-warning">{{ totalFollowing }}</h4>
                                <!-- <p class="mb-0 font-13">+8.4% from last week</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
