namespace server.Models
{
    public class SearchQuery
    {
        public string? Search { get; set; }
        public int? PageIndex { get; set; } =0;
        public int? PageSize { get; set; } = 2;

    }
}