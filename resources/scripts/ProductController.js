let tableBody = document.querySelector("#main-table-body");

document.addEventListener("DOMContentLoaded", () =>{
    getData();
});

function addEventsToBtns() {
    document.querySelectorAll(".btn-danger").forEach((btn) =>{
        btn.addEventListener("click", (e) =>{
            deleteData(btn.parentElement.parentElement.dataset.id);
        });
    });
}

function deleteData(id){
    if(confirm("Deseja realmente excluir esse produto?")){
        var request = new XMLHttpRequest();
        request.open("DELETE", "/api/delete/" + id);
        request.onloadend = () =>{
            getData();
        }
        request.send();
    }
}

function getData(){

    var request = new XMLHttpRequest();

    request.open("GET", "/api/list", true);

    request.onloadstart = () => {
        tableBody.innerHTML = `<tr>
        <td class="dataTables_empty" >Carregando conteudo</td>
        </tr>`
    };

    request.onload = () => {
        let data = JSON.parse(request.response);

        if([...data].length > 0){
            tableBody.innerHTML = "";
            data.forEach(product => {
                tableBody.appendChild(createTableLine(product));
            });
            addEventsToBtns();
        }
        else{
            tableBody.innerHTML = `<tr>
            <td class="dataTables_empty" >Nenhum dado encontrado</td>
            </tr>`;
        }
    };

    request.send();

}

function setupForm(){
    let btn = document.querySelector("#submit-btn");

    btn.addEventListener("submit", (e) =>{
        e.preventDefault();
    });
}

function createTableLine(product){
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${product["lote"]}</td>
        <td>${product["description"]}</td>
        <td>${product["value"]}</td>
        <td><button class="btn btn-sm btn-danger">Excluir</button></td>
    `
    tr.dataset.id = product["_id"];

    return tr;
}
