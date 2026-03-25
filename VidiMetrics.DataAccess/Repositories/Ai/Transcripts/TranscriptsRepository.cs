using VidiMetrics.DataAccess.Data;
using VidiMetrics.Domain.Models.Ai;

namespace VidiMetrics.DataAccess.Repositories.Ai.Transcripts
{
    public class TranscriptsRepository : BaseRepository<Transcript>, ITranscriptsRepository
    {
        public TranscriptsRepository(AppDbContext context) : base(context) { }
    }
}
