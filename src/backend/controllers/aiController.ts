import {Request, Response} from "express";
import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY||"");

export const askAi = async (req: Request, res: Response): Promise<void> =>{
	try{
		const {question, context} = req.body;
		
		const prompt = `
			You are a helpful assistant integrated into a note-taking app.
			Read the following note content and answer the user's question based on it.
			
			Note Content:
			"${context}"
			
			User Question: "${question}"
		`;
		
		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
		//const result = await model.generateContentStream(prompt);
		//const responseText = result.response.text();
		//res.status(200).json({answer: responseText});
		
		// telling express we are sending a stream not a standard json object
		res.setHeader("Content-Type", "text/plain; charset=utf-8" );
		res.setHeader("Transfer-Encoding", "chunked");
		
		const result = await model.generateContent(prompt);
		
		for await (const chunk of result.stream){
			const chunkText = chunk.text();
			res.write(chunkText);
		}
		res.end()
		
	}catch(error){
		console.error("AI Streaming Error", error);
		if(!res.headersSent){
			res.status(500).json({message:"Failed to process AI request."})
		}else{
			res.end("\n\n[Error: Connection interrupted]");
		}
		
	}
}
