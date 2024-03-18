<script>
    import Linkedin from '$lib/icons/linkedin.svelte';
    import Github from '$lib/icons/github.svelte';
</script>

<nav>
    <a href="/" id="blogTitle">tig-blog</a>
    <div class="linkGroup">
        <a href="https://tig-github.github.io/" target=”_blank” id="portfolioLink">tig-portfolio</a>
        <a href="https://www.linkedin.com/in/rayantig/" target=”_blank” class="icon">
            <Linkedin />
        </a>
        <a href="https://github.com/tig-github" target=”_blank” class="icon">
            <Github />
        </a>
    </div>
</nav>
<body>
    <div class="content">
        <slot />
    </div>
</body>

<style>
    nav {
        background-color: #f8deff;
        padding: 2rem;
        display: flex;
        gap: 2rem;
        justify-content: space-around;
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

    #portfolioLink {
        margin-top: 1rem;
        font-size: 1.25rem;
    }

    a {
        text-decoration: none;
        color: black;
    }

    .content {
        margin: 2rem;
    }
</style>