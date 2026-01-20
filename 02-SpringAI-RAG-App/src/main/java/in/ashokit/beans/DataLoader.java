package in.ashokit.beans;

import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;

@Configuration
public class DataLoader {

	@Autowired
	private VectorStore vectorStore;

	@PostConstruct
	public void init() {
		TokenTextSplitter tokenTextSpilitter = new TokenTextSplitter(500, 100, 50, 2000, true);
		
		ClassPathResource resource1 = new ClassPathResource("spring-notes.txt");
		TextReader notesReader1 = new TextReader(resource1);
		List<Document> documents = tokenTextSpilitter.split(notesReader1.get());
		vectorStore.add(documents);
		
		ClassPathResource resource2 = new ClassPathResource("products-data.txt");
		TextReader notesReader2 = new TextReader(resource2);
		documents = tokenTextSpilitter.split(notesReader2.get());
		vectorStore.add(documents);
		
		
	}
}




