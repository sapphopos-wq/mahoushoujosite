/* =========================================
   PROTECTION DU SITE
========================================= */

(function protectSite() {

    const currentFile =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /*
       La page d'accès reste toujours visible.
    */

    if (
        currentFile === "acces.html"
    ) {

        return;

    }


    /*
       Vérifier si l'accès a déjà
       été validé dans cet onglet.
    */

    const hasAccess =
        sessionStorage.getItem(
            "magicalPyanAccess"
        );


    if (
        hasAccess !== "true"
    ) {

        /*
           La page reste cachée pendant
           que le navigateur est redirigé.
        */

        window.location.replace(
            "acces.html"
        );

        return;

    }


    /*
       Accès valide :
       on révèle la page.
    */

    document.body.classList.add(
        "site-authorized"
    );

})();

/* =========================================
   MAGICAL PYAN !!!
   JAVASCRIPT
========================================= */


/* =========================================
   OUTIL — CRÉER LES ÉPISODES
========================================= */

function createEpisodes(numberOfEpisodes) {

    return Array.from(
        { length: numberOfEpisodes },
        (_, index) => ({
            number: index + 1
        })
    );

}


/* =========================================
   OUTIL — CRÉER UNE SAISON
========================================= */

function createSeason(
    id,
    title,
    shortTitle,
    numberOfEpisodes
) {

    return {

        id:
            id,

        title:
            title,

        shortTitle:
            shortTitle,

        episodes:
            createEpisodes(
                numberOfEpisodes
            )

    };

}


/* =========================================
   CATALOGUE DES ANIME
========================================= */

const catalogue = [

    {
        id: "pichi-pichi-pitch",

        title: "Pichi Pichi Pitch",

        alternativeTitles: [
            "Mermaid Melody Pichi Pichi Pitch"
        ],

        url: "pichi-pichi-pitch.html",

        image:
            "images/pichi-pichi-pitch/cover.jpg",

        categories: [
            "Magical Girls",
            "Romance"
        ],

        seasons: [

            createSeason(
                1,
                "Saison 1",
                "Pichi Pichi Pitch",
                52
            ),

            createSeason(
                2,
                "Saison 2",
                "Pichi Pichi Pitch Pure",
                39
            )

        ]

    }

];


/* =========================================
   OUTILS ANIME
========================================= */

function getAnimeById(animeId) {

    return catalogue.find(
        (anime) =>
            anime.id === animeId
    );

}


function getSeason(
    animeId,
    seasonId
) {

    const anime =
        getAnimeById(animeId);


    if (!anime) {

        return null;

    }


    return anime.seasons.find(
        (season) =>
            season.id === Number(seasonId)
    ) || null;

}


function getEpisode(
    animeId,
    seasonId,
    episodeNumber
) {

    const season =
        getSeason(
            animeId,
            seasonId
        );


    if (!season) {

        return null;

    }


    return season.episodes.find(
        (episode) =>
            episode.number ===
            Number(episodeNumber)
    ) || null;

}


/* =========================================
   RECHERCHE
========================================= */

function openSearch() {

    const searchPanel =
        document.getElementById(
            "search-panel"
        );

    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (!searchPanel) {

        return;

    }


    searchPanel.classList.add(
        "open"
    );


    if (searchInput) {

        searchInput.focus();

    }

}


function closeSearchPanel() {

    const searchPanel =
        document.getElementById(
            "search-panel"
        );

    const searchInput =
        document.getElementById(
            "search-input"
        );

    const searchResults =
        document.getElementById(
            "search-results"
        );


    if (searchPanel) {

        searchPanel.classList.remove(
            "open"
        );

    }


    if (searchInput) {

        searchInput.value = "";

    }


    if (searchResults) {

        searchResults.innerHTML = "";

    }

}


function initializeSearch() {

    const searchButton =
        document.getElementById(
            "search-button"
        );

    const closeSearchButton =
        document.getElementById(
            "close-search"
        );

    const searchInput =
        document.getElementById(
            "search-input"
        );

    const searchResults =
        document.getElementById(
            "search-results"
        );


    if (
        !searchButton ||
        !searchInput ||
        !searchResults
    ) {

        return;

    }


    searchButton.addEventListener(
        "click",
        openSearch
    );


    if (closeSearchButton) {

        closeSearchButton.addEventListener(
            "click",
            closeSearchPanel
        );

    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            searchResults.innerHTML = "";


            if (query === "") {

                return;

            }


            /*
               Recherche UNIQUEMENT :
               - titre
               - titres alternatifs
            */

            const matches =
                catalogue.filter(
                    (anime) => {

                        const mainTitle =
                            anime.title
                                .toLowerCase();


                        const alternativeMatch =
                            anime.alternativeTitles
                                .some(
                                    (alternativeTitle) =>
                                        alternativeTitle
                                            .toLowerCase()
                                            .includes(query)
                                );


                        return (
                            mainTitle.includes(query) ||
                            alternativeMatch
                        );

                    }
                );


            if (matches.length === 0) {

                searchResults.innerHTML = `

                    <div class="search-empty">

                        Aucun anime ne correspond à cette recherche.

                    </div>

                `;

                return;

            }


            matches.forEach(
                (anime) => {

                    const result =
                        document.createElement(
                            "a"
                        );


                    result.href =
                        anime.url;


                    result.className =
                        "search-result";


                    result.innerHTML = `

                        <div class="search-result-image">

                            <img
                                src="${anime.image}"
                                alt="${anime.title}"
                            >

                        </div>


                        <div class="search-result-info">

                            <div class="search-result-title">
                                ${anime.title}
                            </div>

                            <div class="search-result-meta">
                                ${anime.alternativeTitles.join(" · ")}
                            </div>

                        </div>

                    `;


                    searchResults.appendChild(
                        result
                    );

                }
            );

        }
    );

}


/* =========================================
   MA LISTE
========================================= */

function getMyList() {

    const savedList =
        localStorage.getItem(
            "myAnimeList"
        );


    if (!savedList) {

        return [];

    }


    try {

        const parsedList =
            JSON.parse(savedList);


        if (!Array.isArray(parsedList)) {

            return [];

        }


        return parsedList;

    } catch (error) {

        return [];

    }

}


function saveMyList(list) {

    localStorage.setItem(
        "myAnimeList",
        JSON.stringify(list)
    );

}


function isInMyList(animeId) {

    return getMyList().includes(
        animeId
    );

}


function toggleMyList(animeId) {

    let list =
        getMyList();


    if (list.includes(animeId)) {

        list =
            list.filter(
                (id) =>
                    id !== animeId
            );

    } else {

        list.push(animeId);

    }


    saveMyList(list);

    updateMyListButtons();

    displayMyList();

}


function updateMyListButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-add-to-list]"
        );


    buttons.forEach(
        (button) => {

            const animeId =
                button.dataset.addToList;


            if (
                isInMyList(animeId)
            ) {

                button.textContent =
                    "♥ Dans ma liste";

                button.classList.add(
                    "in-my-list"
                );

            } else {

                button.textContent =
                    "♡ Ajouter à ma liste";

                button.classList.remove(
                    "in-my-list"
                );

            }

        }
    );

}


document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-add-to-list]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();

        event.stopPropagation();


        const animeId =
            button.dataset.addToList;


        toggleMyList(animeId);

    }
);


/* =========================================
   AFFICHER MA LISTE
========================================= */

function displayMyList() {

    const listGrid =
        document.getElementById(
            "my-list-grid"
        );

    const emptyMessage =
        document.getElementById(
            "my-list-empty"
        );


    if (
        !listGrid ||
        !emptyMessage
    ) {

        return;

    }


    const savedList =
        getMyList();


    listGrid.innerHTML = "";


    if (savedList.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    savedList
        .map(
            (animeId) =>
                getAnimeById(animeId)
        )
        .filter(Boolean)
        .forEach(
            (anime) => {

                const card =
                    document.createElement(
                        "a"
                    );


                card.href =
                    anime.url;


                card.className =
                    "my-list-card";


                card.innerHTML = `

                    <div class="my-list-card-image">

                        <img
                            src="${anime.image}"
                            alt="${anime.title}"
                        >

                    </div>


                    <div class="my-list-card-info">

                        <h2>
                            ${anime.title}
                        </h2>

                        <p>
                            ${anime.alternativeTitles.join(" · ")}
                        </p>

                    </div>

                `;


                listGrid.appendChild(
                    card
                );

            }
        );

}


/* =========================================
   PROGRESSION
========================================= */

function getWatchProgress() {

    const saved =
        localStorage.getItem(
            "watchProgress"
        );


    if (!saved) {

        return {};

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
        ) {

            return {};

        }


        return parsed;

    } catch (error) {

        return {};

    }

}


function saveWatchProgress(
    animeId,
    seasonId,
    episodeNumber,
    position,
    duration
) {

    const allProgress =
        getWatchProgress();


    allProgress[animeId] = {

        animeId:
            animeId,

        season:
            Number(seasonId),

        episode:
            Number(episodeNumber),

        position:
            Number(position) || 0,

        duration:
            Number(duration) || 0,

        updatedAt:
            Date.now()

    };


    localStorage.setItem(
        "watchProgress",
        JSON.stringify(
            allProgress
        )
    );

}


function getAnimeProgress(animeId) {

    const allProgress =
        getWatchProgress();


    return allProgress[animeId]
        || null;

}


function getContinueWatchingList() {

    const allProgress =
        getWatchProgress();


    return Object.values(
        allProgress
    )
        .map(
            (progress) => {

                const anime =
                    getAnimeById(
                        progress.animeId
                    );


                if (!anime) {

                    return null;

                }


                return {

                    anime,

                    progress

                };

            }
        )
        .filter(Boolean)
        .sort(
            (a, b) =>
                b.progress.updatedAt -
                a.progress.updatedAt
        );

}


/* =========================================
   HISTORIQUE
========================================= */

function getWatchHistory() {

    const saved =
        localStorage.getItem(
            "watchHistory"
        );


    if (!saved) {

        return [];

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {

            return [];

        }


        return parsed;

    } catch (error) {

        return [];

    }

}


function saveWatchHistory(history) {

    localStorage.setItem(
        "watchHistory",
        JSON.stringify(history)
    );

}


function addToWatchHistory(
    animeId,
    seasonId,
    episodeNumber
) {

    let history =
        getWatchHistory();


    history =
        history.filter(
            (entry) => !(
                entry.animeId === animeId &&
                entry.season === Number(seasonId) &&
                entry.episode === Number(episodeNumber)
            )
        );


    history.unshift({

        animeId:
            animeId,

        season:
            Number(seasonId),

        episode:
            Number(episodeNumber),

        watchedAt:
            Date.now()

    });


    history =
        history.slice(
            0,
            100
        );


    saveWatchHistory(
        history
    );

}


function formatHistoryDate(
    timestamp
) {

    const date =
        new Date(timestamp);


    return date.toLocaleString(
        "fr-FR",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


function displayWatchHistory() {

    const historyList =
        document.getElementById(
            "history-list"
        );


    const emptyMessage =
        document.getElementById(
            "history-empty"
        );


    if (
        !historyList ||
        !emptyMessage
    ) {

        return;

    }


    const history =
        getWatchHistory();


    historyList.innerHTML = "";


    if (
        history.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    history.forEach(
        (entry) => {

            const anime =
                getAnimeById(
                    entry.animeId
                );


            if (!anime) {

                return;

            }


            const card =
                document.createElement(
                    "a"
                );


            card.className =
                "history-item";


            card.href =
                `player.html?anime=${encodeURIComponent(
                    entry.animeId
                )}&season=${entry.season}&episode=${entry.episode}`;


            const episode =
                String(
                    entry.episode
                ).padStart(
                    2,
                    "0"
                );


            card.innerHTML = `

                <div class="history-item-image">

                    <img
                        src="${anime.image}"
                        alt="${anime.title}"
                    >

                </div>


                <div class="history-item-info">

                    <h2>
                        ${anime.title}
                    </h2>

                    <p class="history-item-episode">
                        Saison ${entry.season}
                        · Épisode ${episode}
                    </p>

                    <p class="history-item-date">
                        ${formatHistoryDate(
                            entry.watchedAt
                        )}
                    </p>

                </div>

            `;


            historyList.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CARTE CONTINUER
========================================= */

function createWatchingCard(
    anime,
    progress
) {

    const card =
        document.createElement(
            "a"
        );


    card.className =
        "watching-card";


    card.href =
        `player.html?anime=${encodeURIComponent(
            anime.id
        )}&season=${progress.season}&episode=${progress.episode}`;


    const episode =
        String(
            progress.episode
        ).padStart(
            2,
            "0"
        );


    const season =
        progress.season;


    let percentage = 0;


    if (
        progress.duration > 0
    ) {

        percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    (
                        progress.position /
                        progress.duration
                    ) * 100
                )
            );

    }


    card.innerHTML = `

        <div class="anime-image">

            <img
                src="${anime.image}"
                alt="${anime.title}"
            >

        </div>


        <div class="progress">

            <div
                class="progress-bar"
                style="width: ${percentage}%"
            ></div>

        </div>


        <div class="anime-info">

            <h3>
                ${anime.title}
            </h3>

            <p>
                Saison ${season} · Épisode ${episode}
            </p>

        </div>

    `;


    return card;

}


/* =========================================
   CONTINUER — ACCUEIL
========================================= */

function updateContinueWatchingHome() {

    const section =
        document.getElementById(
            "continue-watching-section"
        );


    const row =
        section?.querySelector(
            ".anime-row"
        );


    if (
        !section ||
        !row
    ) {

        return;

    }


    const continueList =
        getContinueWatchingList();


    if (
        continueList.length === 0
    ) {

        section.style.display =
            "none";

        return;

    }


    section.style.display =
        "";


    row.innerHTML = "";


    continueList
        .slice(
            0,
            4
        )
        .forEach(
            ({
                anime,
                progress
            }) => {

                row.appendChild(
                    createWatchingCard(
                        anime,
                        progress
                    )
                );

            }
        );

}


/* =========================================
   CONTINUER — TOUT VOIR
========================================= */

function displayAllContinueWatching() {

    const grid =
        document.getElementById(
            "watching-grid"
        );


    const emptyMessage =
        document.getElementById(
            "watching-empty"
        );


    if (
        !grid ||
        !emptyMessage
    ) {

        return;

    }


    const continueList =
        getContinueWatchingList();


    grid.innerHTML = "";


    if (
        continueList.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    continueList.forEach(
        ({
            anime,
            progress
        }) => {

            grid.appendChild(
                createWatchingCard(
                    anime,
                    progress
                )
            );

        }
    );

}


/* =========================================
   PROGRESSION VIDÉO
========================================= */

function initializeVideoProgress(
    anime,
    seasonId,
    episodeNumber
) {

    const video =
        document.getElementById(
            "video-player"
        );


    if (!video) {

        return;

    }


    video.addEventListener(
        "play",
        () => {

            saveWatchProgress(
                anime.id,
                seasonId,
                episodeNumber,
                video.currentTime,
                video.duration
            );


            addToWatchHistory(
                anime.id,
                seasonId,
                episodeNumber
            );

        }
    );


    video.addEventListener(
        "timeupdate",
        () => {

            if (
                !Number.isFinite(
                    video.currentTime
                )
            ) {

                return;

            }


            saveWatchProgress(
                anime.id,
                seasonId,
                episodeNumber,
                video.currentTime,
                video.duration
            );

        }
    );


    video.addEventListener(
        "pause",
        () => {

            saveWatchProgress(
                anime.id,
                seasonId,
                episodeNumber,
                video.currentTime,
                video.duration
            );

        }
    );


    window.addEventListener(
        "beforeunload",
        () => {

            saveWatchProgress(
                anime.id,
                seasonId,
                episodeNumber,
                video.currentTime,
                video.duration
            );

        }
    );

}


/* =========================================
   RESTAURER LA POSITION
========================================= */

function restoreVideoPosition(
    animeId,
    video
) {

    if (!video) {

        return;

    }


    const progress =
        getAnimeProgress(
            animeId
        );


    if (
        !progress ||
        !Number.isFinite(
            progress.position
        )
    ) {

        return;

    }


    const restore =
        () => {

            if (
                !Number.isFinite(
                    video.duration
                ) ||
                video.duration <= 0
            ) {

                return;

            }


            const safePosition =
                Math.min(
                    progress.position,
                    Math.max(
                        0,
                        video.duration - 1
                    )
                );


            video.currentTime =
                safePosition;

        };


    if (
        video.readyState >= 1
    ) {

        restore();

    } else {

        video.addEventListener(
            "loadedmetadata",
            restore,
            {
                once: true
            }
        );

    }

}


/* =========================================
   PARAMÈTRES DU LECTEUR
========================================= */

function getPlayerParameters() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    return {

        animeId:
            parameters.get(
                "anime"
            ) || "pichi-pichi-pitch",

        season:
            Number(
                parameters.get(
                    "season"
                )
            ) || 1,

        episode:
            Number(
                parameters.get(
                    "episode"
                )
            ) || 1

    };

}


/* =========================================
   URL DU LECTEUR
========================================= */

function updatePlayerUrl(
    animeId,
    season,
    episode
) {

    const parameters =
        new URLSearchParams();


    parameters.set(
        "anime",
        animeId
    );


    parameters.set(
        "season",
        season
    );


    parameters.set(
        "episode",
        episode
    );


    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${parameters.toString()}`
    );

}


/* =========================================
   MENUS DU LECTEUR
========================================= */

function populateSeasonSelect(
    anime,
    currentSeason
) {

    const seasonSelect =
        document.getElementById(
            "season-select"
        );


    if (!seasonSelect) {

        return;

    }


    seasonSelect.innerHTML = "";


    anime.seasons.forEach(
        (season) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                season.id;


            option.textContent =
                season.title;


            option.selected =
                season.id ===
                currentSeason;


            seasonSelect.appendChild(
                option
            );

        }
    );

}


function populateEpisodeSelect(
    season,
    currentEpisode
) {

    const episodeSelect =
        document.getElementById(
            "episode-select"
        );


    if (!episodeSelect) {

        return;

    }


    episodeSelect.innerHTML = "";


    season.episodes.forEach(
        (episode) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                episode.number;


            option.textContent =
                String(
                    episode.number
                ).padStart(
                    2,
                    "0"
                );


            option.selected =
                episode.number ===
                currentEpisode;


            episodeSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================
   BOUTONS ÉPISODES
========================================= */

function updateEpisodeButtons(
    anime,
    seasonId,
    episodeNumber
) {

    const previousButton =
        document.getElementById(
            "previous-episode"
        );


    const nextButton =
        document.getElementById(
            "next-episode"
        );


    if (
        !previousButton ||
        !nextButton
    ) {

        return;

    }


    const seasonIndex =
        anime.seasons.findIndex(
            (season) =>
                season.id ===
                seasonId
        );


    const season =
        anime.seasons[
            seasonIndex
        ];


    if (!season) {

        return;

    }


    previousButton.disabled =
        seasonIndex === 0 &&
        episodeNumber === 1;


    nextButton.disabled =
        seasonIndex ===
            anime.seasons.length - 1 &&
        episodeNumber ===
            season.episodes.length;

}


/* =========================================
   SOURCE VIDÉO
========================================= */

function updateVideoSource(
    anime,
    seasonId,
    episodeNumber
) {

    const video =
        document.getElementById(
            "video-player"
        );


    const source =
        document.getElementById(
            "video-source"
        );


    if (
        !video ||
        !source
    ) {

        return;

    }


    source.src = "";

    video.load();

}


/* =========================================
   CHARGER UN ÉPISODE
========================================= */

function loadPlayerEpisode(
    anime,
    seasonId,
    episodeNumber
) {

    const season =
        getSeason(
            anime.id,
            seasonId
        );


    const episode =
        getEpisode(
            anime.id,
            seasonId,
            episodeNumber
        );


    if (
        !season ||
        !episode
    ) {

        return;

    }


    const validEpisode =
        episode.number;


    const seasonSelect =
        document.getElementById(
            "season-select"
        );


    if (seasonSelect) {

        seasonSelect.value =
            String(
                season.id
            );

    }


    populateEpisodeSelect(
        season,
        validEpisode
    );


    updateEpisodeButtons(
        anime,
        season.id,
        validEpisode
    );


    updateVideoSource(
        anime,
        season.id,
        validEpisode
    );


    updatePlayerUrl(
        anime.id,
        season.id,
        validEpisode
    );

}


/* =========================================
   CATÉGORIES AUTOMATIQUES
========================================= */

function displayCategoryAnime() {

    const grid =
        document.getElementById(
            "category-anime-grid"
        );


    if (!grid) {

        return;

    }


    const currentPage =
        window.location.pathname;


    let category = null;


    if (
        currentPage.includes(
            "magical-girls.html"
        )
    ) {

        category =
            "Magical Girls";

    }


    if (
        currentPage.includes(
            "romance.html"
        )
    ) {

        category =
            "Romance";

    }


    if (!category) {

        return;

    }


    const animeInCategory =
        catalogue.filter(
            (anime) =>
                anime.categories.includes(
                    category
                )
        );


    grid.innerHTML = "";


    animeInCategory.forEach(
        (anime) => {

            const card =
                document.createElement(
                    "a"
                );


            card.href =
                anime.url;


            card.className =
                "anime-card";


            card.innerHTML = `

                <div class="anime-image">

                    <img
                        src="${anime.image}"
                        alt="${anime.title}"
                    >

                </div>


                <div class="anime-info">

                    <h3>
                        ${anime.title}
                    </h3>


                    <div class="tags">

                        ${anime.categories.map(
                            (category) => `

                                <span>
                                    ${category}
                                </span>

                            `
                        ).join("")}

                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================
   INITIALISER LE LECTEUR
========================================= */

function initializePlayer() {

    const seasonSelect =
        document.getElementById(
            "season-select"
        );


    const episodeSelect =
        document.getElementById(
            "episode-select"
        );


    const previousButton =
        document.getElementById(
            "previous-episode"
        );


    const nextButton =
        document.getElementById(
            "next-episode"
        );


    if (
        !seasonSelect ||
        !episodeSelect ||
        !previousButton ||
        !nextButton
    ) {

        return;

    }


    const parameters =
        getPlayerParameters();


    const anime =
        getAnimeById(
            parameters.animeId
        );


    if (!anime) {

        return;

    }


    let currentSeason =
        getSeason(
            anime.id,
            parameters.season
        );


    if (!currentSeason) {

        currentSeason =
            anime.seasons[0];

    }


    let currentEpisode =
        getEpisode(
            anime.id,
            currentSeason.id,
            parameters.episode
        );


    if (!currentEpisode) {

        currentEpisode =
            currentSeason.episodes[0];

    }


    populateSeasonSelect(
        anime,
        currentSeason.id
    );


    populateEpisodeSelect(
        currentSeason,
        currentEpisode.number
    );


    updateEpisodeButtons(
        anime,
        currentSeason.id,
        currentEpisode.number
    );


    updateVideoSource(
        anime,
        currentSeason.id,
        currentEpisode.number
    );


    initializeVideoProgress(
        anime,
        currentSeason.id,
        currentEpisode.number
    );


    const video =
        document.getElementById(
            "video-player"
        );


    if (video) {

        restoreVideoPosition(
            anime.id,
            video
        );

    }


    updatePlayerUrl(
        anime.id,
        currentSeason.id,
        currentEpisode.number
    );


    seasonSelect.addEventListener(
        "change",
        () => {

            const newSeasonId =
                Number(
                    seasonSelect.value
                );


            loadPlayerEpisode(
                anime,
                newSeasonId,
                1
            );

        }
    );


    episodeSelect.addEventListener(
        "change",
        () => {

            const newEpisode =
                Number(
                    episodeSelect.value
                );


            loadPlayerEpisode(
                anime,
                Number(
                    seasonSelect.value
                ),
                newEpisode
            );

        }
    );


    previousButton.addEventListener(
        "click",
        () => {

            const seasonId =
                Number(
                    seasonSelect.value
                );


            const episodeNumber =
                Number(
                    episodeSelect.value
                );


            const seasonIndex =
                anime.seasons.findIndex(
                    (season) =>
                        season.id ===
                        seasonId
                );


            if (
                episodeNumber > 1
            ) {

                loadPlayerEpisode(
                    anime,
                    seasonId,
                    episodeNumber - 1
                );

                return;

            }


            if (
                seasonIndex > 0
            ) {

                const previousSeason =
                    anime.seasons[
                        seasonIndex - 1
                    ];


                const lastEpisode =
                    previousSeason.episodes[
                        previousSeason
                            .episodes.length - 1
                    ];


                loadPlayerEpisode(
                    anime,
                    previousSeason.id,
                    lastEpisode.number
                );

            }

        }
    );


    nextButton.addEventListener(
        "click",
        () => {

            const seasonId =
                Number(
                    seasonSelect.value
                );


            const episodeNumber =
                Number(
                    episodeSelect.value
                );


            const currentSeasonIndex =
                anime.seasons.findIndex(
                    (season) =>
                        season.id ===
                        seasonId
                );


            const currentSeason =
                anime.seasons[
                    currentSeasonIndex
                ];


            if (!currentSeason) {

                return;

            }


            if (
                episodeNumber <
                currentSeason.episodes.length
            ) {

                loadPlayerEpisode(
                    anime,
                    seasonId,
                    episodeNumber + 1
                );

                return;

            }


            const nextSeason =
                anime.seasons[
                    currentSeasonIndex + 1
                ];


            if (!nextSeason) {

                return;

            }


            loadPlayerEpisode(
                anime,
                nextSeason.id,
                1
            );

        }
    );

}


/* =========================================
   FORMULAIRE — MON ESPACE
========================================= */

function countWords(text) {

    const trimmedText =
        text.trim();


    if (trimmedText === "") {

        return 0;

    }


    return trimmedText.split(/\s+/).length;

}


function initializeContactForm() {

    const openContactForm =
        document.getElementById(
            "open-contact-form"
        );


    const contactSection =
        document.getElementById(
            "contact-section"
        );


    const contactForm =
        document.getElementById(
            "contact-form"
        );


    const contactType =
        document.getElementById(
            "contact-type"
        );


    const animeNameField =
        document.getElementById(
            "anime-name-field"
        );


    const animeName =
        document.getElementById(
            "anime-name"
        );


    const contactMessage =
        document.getElementById(
            "contact-message"
        );


    const wordCount =
        document.getElementById(
            "contact-word-count"
        );


    const errorMessage =
        document.getElementById(
            "contact-error"
        );


    if (
        !openContactForm ||
        !contactSection ||
        !contactForm ||
        !contactType ||
        !animeNameField ||
        !animeName ||
        !contactMessage ||
        !wordCount
    ) {

        return;

    }


    function showContactForm() {

        contactSection.classList.add(
            "open"
        );


        contactSection.style.display =
            "block";


        contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    openContactForm.addEventListener(
        "click",
        showContactForm
    );


    openContactForm.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                showContactForm();

            }

        }
    );


    function updateAnimeField() {

        if (
            contactType.value === "Proposer un anime"
        ) {

            animeNameField.style.display =
                "";

            animeName.required =
                true;

        } else {

            animeNameField.style.display =
                "none";

            animeName.required =
                false;

            animeName.value =
                "";

        }

    }


    contactType.addEventListener(
        "change",
        updateAnimeField
    );


    updateAnimeField();


    contactMessage.addEventListener(
        "input",
        () => {

            const words =
                countWords(
                    contactMessage.value
                );


            wordCount.textContent =
                words;


            if (
                words > 3000
            ) {

                wordCount.classList.add(
                    "too-many-words"
                );

            } else {

                wordCount.classList.remove(
                    "too-many-words"
                );

            }

        }
    );


    contactForm.addEventListener(
        "submit",
        (event) => {

            const words =
                countWords(
                    contactMessage.value
                );


            if (errorMessage) {

                errorMessage.textContent =
                    "";

            }


            if (contactType.value === "") {

                event.preventDefault();

                if (errorMessage) {

                    errorMessage.textContent =
                        "Choisis le type de message.";

                }

                return;

            }


            if (
                contactType.value === "Proposer un anime" &&
                animeName.value.trim() === ""
            ) {

                event.preventDefault();

                if (errorMessage) {

                    errorMessage.textContent =
                        "Indique le nom de l'anime.";

                }

                return;

            }


            if (
                contactMessage.value.trim() === ""
            ) {

                event.preventDefault();

                if (errorMessage) {

                    errorMessage.textContent =
                        "Écris un message.";

                }

                return;

            }


            if (
                words > 3000
            ) {

                event.preventDefault();

                if (errorMessage) {

                    errorMessage.textContent =
                        "Ton message dépasse la limite de 3000 mots.";

                }

                return;

            }

        }
    );

}


/* =========================================
   PAGE D'ACCÈS
========================================= */

function initializeAccessPage() {

    /* =========================================
       AUDIO — TÉLÉVISION
    ========================================= */

    const tvAudio =
        document.getElementById(
            "tv-audio"
        );


    function startBackgroundTV() {

        if (!tvAudio) {

            return;

        }


        tvAudio.volume =
            0.35;


        tvAudio.loop =
            true;


        const promise =
            tvAudio.play();


        if (promise) {

            promise.catch(
                () => {

                    /*
                       Le navigateur peut bloquer
                       l'autoplay sonore.
                    */

                }
            );

        }

    }


    /*
       Tentative immédiate.
    */

    startBackgroundTV();


    /*
       Secours si le navigateur bloque
       l'autoplay.
    */

    document.addEventListener(
        "pointerdown",
        startBackgroundTV,
        {
            once: true
        }
    );


    document.addEventListener(
        "keydown",
        startBackgroundTV,
        {
            once: true
        }
    );


    /* =========================================
       SON DES LETTRES
    ========================================= */

    let typingAudioContext =
        null;


    function getTypingAudioContext() {

        if (!typingAudioContext) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContext) {

                return null;

            }


            typingAudioContext =
                new AudioContext();

        }


        if (
            typingAudioContext.state ===
            "suspended"
        ) {

            typingAudioContext.resume();

        }


        return typingAudioContext;

    }


    function playTypingSound() {

        const context =
            getTypingAudioContext();


        if (!context) {

            return;

        }


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.type =
            "square";


        oscillator.frequency.setValueAtTime(
            1050 +
                Math.random() * 120,
            context.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            500,
            context.currentTime + 0.035
        );


        gain.gain.setValueAtTime(
            0.0001,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.035,
            context.currentTime + 0.003
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + 0.045
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.start();


        oscillator.stop(
            context.currentTime + 0.05
        );

    }


/* =========================================
   ANIMATION DU MESSAGE
========================================= */

const accessMessage =
    document.querySelector(
        ".access-message"
    );


if (accessMessage) {

    const firstParagraph =
        accessMessage.querySelector(
            "p:first-child"
        );


    const secondParagraph =
        accessMessage.querySelector(
            "p:last-child"
        );


    /*
       Récupérer les textes avant
       de vider les paragraphes.
    */

    const firstText =
        firstParagraph
            ? firstParagraph.textContent.trim()
            : "";


    const secondText =
        secondParagraph
            ? secondParagraph.textContent.trim()
            : "";


    /*
       On vide immédiatement les textes.
       Le conteneur reste visible.
    */

    if (firstParagraph) {

        firstParagraph.textContent =
            "";

    }


    if (secondParagraph) {

        secondParagraph.textContent =
            "";

    }


    function animateText(
        element,
        text,
        speed,
        callback
    ) {

        if (
            !element ||
            !text
        ) {

            return;

        }


        let index =
            0;


        const timer =
            setInterval(
                () => {

                    const character =
                        text.charAt(
                            index
                        );


                    element.textContent +=
                        character;


                    /*
                       Son de touche sur chaque
                       caractère visible.
                    */

                    if (
                        character.trim() !== ""
                    ) {

                        playTypingSound();

                    }


                    index++;


                    if (
                        index >=
                        text.length
                    ) {

                        clearInterval(
                            timer
                        );


                        if (callback) {

                            callback();

                        }

                    }

                },
                speed
            );

    }


    /*
       ENTRE.
    */

    animateText(
        firstParagraph,
        firstText,
        55,
        () => {

            /*
               Pause après "ENTRE."
            */

            setTimeout(
                () => {

                    animateText(
                        secondParagraph,
                        secondText,
                        32
                    );

                },
                700
            );

        }
    );

}


    /* =========================================
       CONTRÔLES D'ACCÈS
    ========================================= */

    const passwordInput =
        document.getElementById(
            "access-password"
        );


    const submitButton =
        document.getElementById(
            "access-submit"
        );


    const errorMessage =
        document.getElementById(
            "access-error"
        );


    if (
        !passwordInput ||
        !submitButton ||
        !errorMessage
    ) {

        return;

    }


    /*
       Mot de passe.
    */

    const correctPassword =
        "WomenRuleZaWarudo!";


    /*
       Vérifier le mot de passe.
    */

    function checkPassword() {

        const enteredPassword =
            passwordInput.value;


        if (
            enteredPassword ===
            correctPassword
        ) {

            sessionStorage.setItem(
                "magicalPyanAccess",
                "true"
            );


            window.location.href =
                "index.html";


            return;

        }


        showAccessError();

    }


    /*
       Afficher l'erreur.
    */

    function showAccessError() {

        passwordInput.style.display =
            "none";


        submitButton.style.display =
            "none";


        errorMessage.innerHTML = `

            <span class="access-error-message">
                Memento Mori
            </span>

            <span
                class="access-countdown"
                id="access-countdown"
            >
                10
            </span>

        `;


        errorMessage.classList.add(
            "show"
        );


        let remainingSeconds =
            10;


        const countdown =
            document.getElementById(
                "access-countdown"
            );


        const timer =
            setInterval(
                () => {

                    remainingSeconds--;


                    if (countdown) {

                        countdown.textContent =
                            remainingSeconds;

                    }


                    if (
    remainingSeconds <= 0
) {

    clearInterval(
        timer
    );


    /*
       On fait disparaître complètement
       la page actuelle.
    */

    document.documentElement.innerHTML =
        "";


    document.documentElement.style.background =
        "#000000";

}

                },
                1000
            );

    }


    /*
       Clic sur Entrer.
    */

    submitButton.addEventListener(
        "click",
        checkPassword
    );


    /*
       Entrée au clavier.
    */

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                checkPassword();

            }

        }
    );

}


/* =========================================
   NEIGE TV
========================================= */

function initializeTVStatic() {

    const canvas =
        document.getElementById(
            "tv-static"
        );


    if (!canvas) {

        return;

    }


    const context =
        canvas.getContext(
            "2d"
        );


    if (!context) {

        return;

    }


    let width = 0;

    let height = 0;


    function resizeCanvas() {

        width =
            Math.max(
                1,
                Math.floor(
                    window.innerWidth / 2
                )
            );


        height =
            Math.max(
                1,
                Math.floor(
                    window.innerHeight / 2
                )
            );


        canvas.width =
            width;


        canvas.height =
            height;


        canvas.style.width =
            window.innerWidth + "px";


        canvas.style.height =
            window.innerHeight + "px";

    }


    function drawStatic() {

        const imageData =
            context.createImageData(
                width,
                height
            );


        const pixels =
            imageData.data;


        for (
            let index = 0;
            index < pixels.length;
            index += 4
        ) {

            const value =
                Math.floor(
                    Math.random() * 256
                );


            pixels[index] =
                value;


            pixels[index + 1] =
                value;


            pixels[index + 2] =
                value;


            pixels[index + 3] =
                255;

        }


        context.putImageData(
            imageData,
            0,
            0
        );


        requestAnimationFrame(
            drawStatic
        );

    }


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    drawStatic();

}


/* =========================================
   CACHER LE TEXTE IMMÉDIATEMENT
========================================= */

/*
   Le script est chargé en bas de la page,
   donc on peut cacher le message immédiatement,
   avant le prochain rendu visuel du navigateur.
*/


/* =========================================
   INITIALISATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeSearch();

        updateMyListButtons();

        displayMyList();

        updateContinueWatchingHome();

        displayAllContinueWatching();

        displayWatchHistory();

        initializePlayer();

        displayCategoryAnime();

        initializeContactForm();

        initializeAccessPage();

        initializeTVStatic();

    }
);