package in.ashokit.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RagRestController {

	@Autowired
	private RagService ragService;

	@GetMapping("/rag")
	public String ask(@RequestParam String question) {
		return ragService.ask(question);
	}

}
