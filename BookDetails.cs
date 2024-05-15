namespace BookDetails
{
    public class BookDetails
    {
           public int BookID { get; set; }
            public string BookName { get; set; }
            public string Author { get; set; }
            public string PublishedYear { get; set; }
            public string PublishedBy { get; set; }

            public BookDetails()
            {
                BookName = string.Empty;
                Author = string.Empty;
                PublishedYear = string.Empty;
                PublishedBy = string.Empty;
            }
            public BookDetails(int bookID,string bookName, string author, string publishedYear, string publishedBy)
            {
                BookID= bookID;
                BookName = bookName;
                Author = author;
                PublishedYear = publishedYear;
                PublishedBy = publishedBy;
            }
}
}
