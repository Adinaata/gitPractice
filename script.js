const kumpulanBuku = []
const renderEvent = 'render-book'
const storageKey = 'BOOKSHELF_APPS'
const savedEvent = 'saved-book'

let editingBukuId = null

function cekStorage(){
    if (typeof Storage === undefined){
        alert("Browser Anda tidak mendukung Local Storage")
        return false
    }
    return true
}

function buatId(){
    return +new Date()
}

function buatObjekBuku(id, title, author, year,isComplete){
    return {
        id, title, author, year, isComplete
    }
}

function simpanData(){
    if(cekStorage()){
        const parsed = JSON.stringify(kumpulanBuku)
        localStorage.setItem(storageKey, parsed)
        document.dispatchEvent(new Event(savedEvent))
    }
}

function  ambilData(){
    const serializedData = localStorage.getItem(storageKey)
    const data = JSON.parse(serializedData)

    if(data !== null){
        for (const buku of data){
            kumpulanBuku.push(buku)
        }   
    }
    document.dispatchEvent(new Event(renderEvent))
}

function cariBuku(idBuku){
    for (const itemBuku of kumpulanBuku){
        if (itemBuku.id === idBuku){
            return itemBuku
        }
    }
    return null
}

function cariIndexBuku(idBuku){
    for(const index in kumpulanBuku){
        if(kumpulanBuku[index].id === idBuku){
            return  index

        }
    }
    return -1
}



function tambahBuku(){
    const judulBuku = document.getElementById('bookFormTitle').value
    const penulisBuku = document.getElementById('bookFormAuthor').value
    const tahunBuku = parseInt(document.getElementById('bookFormYear').value)
    const dibacaBuku = document.getElementById('bookFormIsComplete').checked

    const idBuku = buatId()
    const objekBuku = buatObjekBuku(idBuku,judulBuku,penulisBuku,tahunBuku,dibacaBuku)
    kumpulanBuku.push(objekBuku)

    document.dispatchEvent(new Event(renderEvent))
    simpanData()

}

function buatBuku(objekBuku){
    const judulBuku = document.createElement('h3')
    judulBuku.innerText = objekBuku.title
    judulBuku.setAttribute('data-testid','bookItemTitle')
    
    const penulisBuku = document.createElement('p')
    penulisBuku.innerText = `Penulis: ${objekBuku.author}`
    penulisBuku.setAttribute('data-testid','bookItemAuthor')

    const tahunBuku = document.createElement('p')
    tahunBuku.innerText = `Tahun Terbit: ${objekBuku.year}`
    tahunBuku.setAttribute('data-testid','bookItemYear')

    const textContainer = document.createElement('div')
    textContainer.append(judulBuku,penulisBuku,tahunBuku)

    const container = document.createElement('div')
    container.classList.add('book_item')
    container.setAttribute('data-bookid',objekBuku.id)
    container.setAttribute('data-testid','bookItem')
    container.append(textContainer)



    if (objekBuku.isComplete){
        const undoButton = document.createElement('button')
        undoButton.innerText = "Belum Selesai dibaca"
        undoButton.setAttribute('data-testid', 'bookItemIsCompleteButton')
        undoButton.addEventListener('click', function(){
            undoBook(objekBuku.id)
        })
        const deleteButton = document.createElement('button')
        deleteButton.innerText = "Hapus Buku"
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton')
        deleteButton.addEventListener('click', function(){
            deleteBook(objekBuku.id)
        })
        const editButton = document.createElement('button')
        editButton.innerText = "Edit Buku"
        editButton.setAttribute('data-testid', 'bookItemEditButton')
        editButton.addEventListener('click', function(){
            editBuku(objekBuku.id)
        })
        container.append(undoButton,deleteButton,editButton)
    } else {
        const completeButton = document.createElement('button')
        completeButton.innerText = "Selesai dibaca"
        completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton')
        completeButton.addEventListener('click', function(){
            completeBook(objekBuku.id)
        })
        const deleteButton = document.createElement('button')
        deleteButton.innerText = "Hapus Buku"
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton')
        deleteButton.addEventListener('click', function(){
            deleteBook(objekBuku.id)
        })
        const editButton = document.createElement('button')
        editButton.innerText = "Edit Buku"
        editButton.setAttribute('data-testid', 'bookItemEditButton')
        editButton.addEventListener('click', function(){
            editBuku(objekBuku.id)
        })
        container.append(completeButton, deleteButton, editButton)
    }
    return container
}
function completeBook(idBuku){
    const targetBuku = cariBuku(idBuku)
    if (targetBuku == null) return
    targetBuku.isComplete = true
    document.dispatchEvent(new Event(renderEvent))
    simpanData()
}
function undoBook(idBuku){
    const targetBuku = cariBuku(idBuku)
    if (targetBuku == null) return
    targetBuku.isComplete = false
    document.dispatchEvent(new Event(renderEvent))
    simpanData()
}
function deleteBook(idBuku){
    const targetIndexBuku = cariIndexBuku(idBuku)
    if (targetIndexBuku === -1) return
    kumpulanBuku.splice(targetIndexBuku,1)
    document.dispatchEvent(new Event(renderEvent))
    simpanData()
}

document.addEventListener(renderEvent, function(){
    const incompleteBookList = document.getElementById('incompleteBookList')
    incompleteBookList.innerHTML = ''
    const completeBookList = document.getElementById('completeBookList')
    completeBookList.innerHTML = ''

    for (const itemBuku of kumpulanBuku ){
        const elemenBuku = buatBuku(itemBuku)
        if (!itemBuku.isComplete){
            incompleteBookList.append(elemenBuku)
        }else{
            completeBookList.append(elemenBuku)
        }
    }
})

document.addEventListener(savedEvent, function(){
    console.log(localStorage.getItem(storageKey))
})


document.getElementById('bookForm').addEventListener('submit', function(event){
    event.preventDefault()
    tambahBuku()
})
if(cekStorage()){
    ambilData()
}