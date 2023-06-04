const display=document.getElementById("displayBook");
const searchInput=document.getElementById("searchInput");
const searchButton=document.getElementById("searchButton");
const max=10;
let startIndex=0;
const createElement=(tag)=> document.createElement(tag);

const createBookElement=(Id,titles,authors,image,publishers,publishdates)=> 
{
    const div=createElement("div");
    div.setAttribute("id", Id);
    div.classList.add("card"); 
    display.appendChild(div);
  
    const img=createElement("img");
    img.classList.add("image");
    img.src=image;
    div.appendChild(img);
  
    const title=createElement("h3");
    title.classList.add("title");
    title.innerText=`Title: ${titles}`;
    div.appendChild(title);
  
    const author=createElement("h3");
    author.classList.add("author");
    author.innerText=`Author: ${authors}`;
    div.appendChild(author);
  
    const publisher=createElement("h3");
    publisher.classList.add("publisher");
    publisher.innerText=`Publisher: ${publishers}`;
    div.appendChild(publisher);
  
    const publishdate=createElement("h3");
    publishdate.classList.add("publishdate");
    publishdate.innerText=`Publish Date: ${publishdates}`;
    div.appendChild(publishdate);
};
const fetchBooks=(searchTerm)=> 
{
  const bk=new XMLHttpRequest();
  bk.onload=()=> 
  {
    if (bk.status==200) 
    {
      const response=JSON.parse(bk.responseText);
      const books=response.items;
      console.log(books);
      const bookData=[];
      for(let book of books) 
      {
        const id=book.id;
        const title=book.volumeInfo.title;
        const authors=book.volumeInfo.authors;
        const thumbnail=book.volumeInfo.imageLinks?.thumbnail;
        const publisher=book.volumeInfo.publisher;
        const publisherdate=book.volumeInfo.publishedDate;
        if (id&&title&&authors&&thumbnail&&publisher&&publisherdate) 
        {
          bookData.push({id,title,authors,thumbnail,publisher,publisherdate});
        }
      }
      displayBooks(bookData);
      if(startIndex+max<response.totalItems) 
      {
        startIndex=startIndex+max;
        fetchBooks(searchTerm);
      }
    } 
    else 
    {
      console.log("Error:",bk.status);
    }
  };
  const url=`https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchTerm}&startIndex=${startIndex}&max=${max}`;
  bk.open("GET", url);
  bk.send();
};

const displayBooks=(bookData)=> 
{
  for(let book of bookData) 
  {
    const{id,title,authors,thumbnail,publisher,publisherdate}=book;
    createBookElement(id,title,authors,thumbnail,publisher,publisherdate);
  }
};
const handleSearch=()=> 
{
  const searchTerm=searchInput.value.trim();
  if (searchTerm!="") 
  {
    display.innerHTML="";
    startIndex=0;
    fetchBooks(searchTerm);
  }
};

searchButton.addEventListener("click", handleSearch);