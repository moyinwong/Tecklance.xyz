//load info of particular task from database
async function main() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id')
    let res = await fetch(`/task/${id}`, {
        method: 'GET'
    })
    let task = await res.json();
    console.log(task)
    let titleContainer = document.querySelector("#title");
    let contentContainer = document.querySelector("#content")
    

        titleContainer.innerHTML = "";
        contentContainer.innerHTML

        titleContainer.innerHTML += task.title;
        contentContainer.innerHTML += task.content;

       
}

main();