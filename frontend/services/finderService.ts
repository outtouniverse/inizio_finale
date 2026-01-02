
import { FinderResult } from '../types';

// Simulated delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const scanPlatform = async (platform: string, query: string): Promise<FinderResult[]> => {
    // Simulate network latency variance
    const latency = Math.random() * 2000 + 1000; 
    await delay(latency);

    const baseId = Date.now().toString();
    
    // Mock data generation based on query to feel "real"
    const keywords = query.split(' ').filter(w => w.length > 3);
    const topic = keywords.length > 0 ? keywords[0] : "startup";

    const templates = [
        { text: `I'm struggling with ${topic}. Any good alternatives?`, sentiment: 'Negative' },
        { text: `Has anyone tried a tool for ${topic}? The current ones are too expensive.`, sentiment: 'Neutral' },
        { text: `Finally found a good workflow for ${topic} but it lacks integration.`, sentiment: 'Positive' },
        { text: `Why is ${topic} so hard in 2025?`, sentiment: 'Negative' },
        { text: `Looking for beta testers for my ${topic} app.`, sentiment: 'Neutral' }
    ];

    const results: FinderResult[] = [];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 results per platform

    for (let i = 0; i < count; i++) {
        const t = templates[Math.floor(Math.random() * templates.length)];
        results.push({
            id: `${platform}-${baseId}-${i}`,
            platform: platform,
            username: `user_${Math.floor(Math.random() * 1000)}`,
            snippet: t.text,
            relevance: Math.floor(Math.random() * 30) + 70, // 70-100
            url: '#',
            date: `${Math.floor(Math.random() * 24)}h ago`,
            sentiment: t.sentiment as any
        });
    }

    return results;
};

// Generator to stream results
export async function* streamUserFinder(query: string) {
    const platforms = ['Reddit', 'Twitter', 'IndieHackers', 'HackerNews', 'YouTube'];
    
    // Shuffle platforms to make order random
    const shuffled = platforms.sort(() => 0.5 - Math.random());

    for (const platform of shuffled) {
        const results = await scanPlatform(platform, query);
        yield { platform, results };
    }
}
