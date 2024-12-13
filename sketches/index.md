<input type="text" id="search" name="search" placeholder="search" />
<div id="ls" class="ls">

<script>
    const ls = document.getElementsByClassName("ls")[0];
    ls.innerHTML = window.parent.ls();
    window.parent.initSearch(
        document.getElementById("search"),
        document.getElementById("ls")
    );
</script>
