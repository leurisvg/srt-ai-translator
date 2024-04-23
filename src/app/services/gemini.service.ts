import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AiResponse } from '../interfaces/ai-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  http = inject(HttpClient);
  generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
  };
  
  safetySettings: SafetySetting[] = [
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
  
  translate(prompt: string[], from: string, to: string): Observable<AiResponse> {
    return new Observable(observer => {
      const genAI = new GoogleGenerativeAI(environment.apiKey);
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.0-pro-latest',
        safetySettings: this.safetySettings,
        generationConfig: this.generationConfig,
      });
      
      model.generateContent(`
          Translate from ${ from } to ${ to } this array of strings: [${ prompt.map(str => `"${str}"`) }].
          You must respond in valid JSON format.
          In the JSON you must return another array of strings with the EXACT same length in ${ to } language.
          You must escape quotes and special characters in the response.
  
          Output example:
          {
            translation: string[] // Array of strings with the EXACT length of the original
          }
      `).then(result => {
        const cleanedJson = this.removeInvalidChars(result.response.text());
        let json;
        
        try {
          json = JSON.parse(cleanedJson);
        } catch (e) {
          observer.error({ error: 'Something failed', description: 'Something went wrong, please try again' });
        }
        
        observer.next(json);
        observer.complete();
      }).catch(e => {
        observer.error({ error: 'Blocked by AI', description: 'AI blocked the translation due to their safety politics' });
      });
    });
  }
  
  removeInvalidChars = (jsonString: string) => {
    return jsonString
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/```json/g, '')
    .replace(/```JSON/g, '')
    .replace(/```/g, '');
  }
}
