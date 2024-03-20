<script>
    import Linkedin from '$lib/icons/linkedin.svelte';
    import Github from '$lib/icons/github.svelte';
    import Yaz from '$lib/icons/yaz.svelte';
</script>

<nav>
    <a href="/" id="blogTitle">tig-blog</a>
    <div class="linkGroup">
        <a href="https://tig-github.github.io/" target=”_blank” id="yazIcon">
            <Yaz />
        </a>
        <a href="https://www.linkedin.com/in/rayantig/" target=”_blank” class="icon">
            <Linkedin />
        </a>
        <a href="https://github.com/tig-github" target=”_blank” class="icon">
            <Github />
        </a>
    </div>
</nav>
<body>
    <div class="bodyLayout">
        <div class="content">
            <slot />
        </div>
        <div class="sidebar">
            <a href="/post1">
                demo article 1
            </a>
            <a href="/post2">
                demo article 2
            </a>
            <a href="/post3">
                demo article 3
            </a>
        </div>
    </div>
</body>

<style>
    nav {
        background-color: #f7e5fc;
        padding: 2rem;
        display: flex;
        gap: 2rem;
        justify-content: space-around;
    }

    div.bodyLayout {
        display: flex;
        flex-direction: row;
    }

    div.content {
        display: flex;
        flex-direction: column;
        width: 80%;
        justify-content: center;
        text-align: center;

    }

    div.sidebar {
        display: flex;
        flex-direction: column;
        width: 20%;
        gap: 2rem;
        margin-top: 3.5rem;
    }

    div.linkGroup {
        display: flex;
        gap: 2rem;
        white-space: nowrap;
    }

    #blogTitle {
        width: 75%;
        font-size: 2.5rem;
        font-weight: bold;
    }

    #yazIcon {
        margin-bottom: 0rem;
    }

    a {
        text-decoration: none;
        color: black;
    }

    .content {
        margin: 2rem;
    }
</style>