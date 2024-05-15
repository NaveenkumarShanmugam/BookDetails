using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
namespace BookDetails.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        SqlConnection con = new SqlConnection("server=localhost;database=BookDetails;User Id=sa;Password=sa@123;");

        [HttpGet]
        public IActionResult Get()
        {
            SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Books", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                return Ok(JsonConvert.SerializeObject(dt));
            }
            else
            {
                return Ok("No data found");
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] BookDetails book)
        {
            
            BookDetails books = new BookDetails(book.BookID,book.BookName, book.Author, book.PublishedYear, book.PublishedBy);
            SqlCommand cmd = new SqlCommand("Insert into Books(BookID,BookName,Author,PublishedYear,PublishedBy) Values('" + book.BookID + "','" + books.BookName + "','" + books.Author + "','" + books.PublishedYear + "','" + books.PublishedBy + "')", con);
            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            if (i == 1)
            {
                return Ok(books);
            }
            else
            {
                return Ok("Try again .No data inserted");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] BookDetails book)
        {
            SqlCommand cmd = new SqlCommand("Update Books Set BookName='" + book.BookName + "',Author='" + book.Author + "',PublishedYear='" + book.PublishedYear + "',PublishedBy='" + book.PublishedBy + "' WHERE BookID=" + id, con);
            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            if (i == 1)
            {
                return Ok(book);
            }
            else
            {
                return Ok("Try again .No data updated");
            }

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            SqlCommand cmd = new SqlCommand("Delete From Books WHERE BookID=" + id, con);
            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            if (i == 1)
            {
                return Ok(id);
            }
            else
            {
                return Ok("Try again .No data deleted");
            }
        }
    }
}
