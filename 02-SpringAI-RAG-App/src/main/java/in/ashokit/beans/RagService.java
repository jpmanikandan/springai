package in.ashokit.beans;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

@Service
public class RagService {

	private ChatClient chatClient;

	private VectorStore vectorStore;

	public RagService(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
		this.chatClient = chatClientBuilder.build();
		this.vectorStore = vectorStore;
	}

	public String ask(String question) {

		List<Document> documents = vectorStore
				.similaritySearch(SearchRequest.builder().topK(3).query(question).build());

		System.out.println(documents.size());

		for (Document doc : documents) {
			System.out.println(doc.getFormattedContent());
		}

		if (documents.isEmpty()) {
			return "I Don't Know What You are Asking";
		}

		String context = documents.stream()
				.map(Document::getFormattedContent)
				.collect(Collectors.joining("\n"));

		return chatClient.prompt()
				.system("""
						You are a helpful AI Assistant.
						Answer the question using only the provided context.
						If the context does not contain the answer, say "I don't know"
						""")
				.user("""
						Question:
						%s

						Context:
						%s
						""".formatted(question, context))
				.call()
				.content();
	}
}
