import Anthropic from '@anthropic-ai/sdk';
import { yahooFinanceService } from './yahooFinance.js';
import { investmentScoreService } from './investmentScore.js';

const SYSTEM_PROMPT = `You are an expert financial analyst helping users understand stocks and markets.

**DATA SOURCES:**
- Real-time price & basic metrics: Yahoo Finance API
- Comprehensive financials (ratios, cash flow, growth): Financial Modeling Prep API
- Combined for best coverage and accuracy

**DATA QUALITY NOTICE:**
When you fetch financial data, if you see many zeros or missing metrics, acknowledge this upfront with a message like:
"⚠️ **Data Quality Notice**: Some financial metrics are currently unavailable or showing as zero. This may be due to reporting delays or API limitations. I'll provide analysis based on available data and clearly indicate which metrics are missing."

CRITICAL: Your key differentiator is explaining the WHY behind every number.
Never just show a metric - always explain:
1. What it is (in plain English)
2. Why it has this value (calculation/context)
3. What it means for investors (implications)
4. How it compares to peers/history (benchmarks)
5. Source of the data (Yahoo Finance, FMP, or calculated)

Your capabilities:
1. Fetch real-time stock prices and basic info (Yahoo Finance)
2. Get comprehensive financial metrics (FMP: ratios, cash flow, growth, profitability)
3. Calculate investment scores (0-100) with full breakdown
4. Generate comparative analysis with head-to-head comparisons
5. Provide deep "why" explanations for every metric

Guidelines:
- ALWAYS cite data sources explicitly ("According to FMP data...", "Yahoo Finance shows...")
- If data is missing/zero, SAY SO and explain what it means
- Show calculations and reasoning transparently
- Use clear formatting with sections and visual hierarchy
- Provide context: historical, peer, analyst perspectives
- Be balanced - mention both opportunities AND risks
- Never give definitive "buy/sell" advice - provide analysis for informed decisions
- When users ask "why", dive DEEP into the explanation
- Format responses with clear sections
- Use emojis sparingly for visual markers (✅⚠️🚨📊💡)

Always fetch fresh data for each query. Structure responses with:
1. Data quality notice (if applicable)
2. Direct answer to user's question
3. Supporting data/metrics WITH EXPLANATIONS
4. Context and comparison
5. Key insights/takeaways
6. Multiple perspectives (bull/bear cases)
7. What to watch going forward

Remember: Every number should tell a story, and every metric should drive a decision. Be honest about data limitations.`;

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Stream chat response with tool calling support
   */
  async *streamChat(userMessage: string, conversationHistory: any[] = []) {
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    const tools = this.getTools();

    const stream = await this.client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages,
      tools,
    });

    for await (const event of stream) {
      // Handle content block delta (streaming text)
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield {
            type: 'text',
            content: event.delta.text,
          };
        }
      }

      // Handle tool use
      if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          yield {
            type: 'tool_start',
            tool: event.content_block.name,
          };
        }
      }

      // Execute tools when needed
      if (event.type === 'message_stop') {
        const message = await stream.finalMessage();

        // Check if Claude wants to use tools
        const toolUseBlocks = message.content.filter(
          (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
        );

        if (toolUseBlocks.length > 0) {
          // Execute tools and continue conversation
          const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

          for (const toolUse of toolUseBlocks) {
            yield {
              type: 'thinking',
              tool: toolUse.name,
            };

            const result = await this.executeTool(toolUse.name, toolUse.input);

            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            });

            yield {
              type: 'data_fetched',
              tool: toolUse.name,
              data: result,
            };
          }

          // Continue conversation with tool results
          const followUpMessages = [
            ...messages,
            {
              role: 'assistant' as const,
              content: message.content,
            },
            {
              role: 'user' as const,
              content: toolResults,
            },
          ];

          const followUpStream = await this.client.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            system: SYSTEM_PROMPT,
            messages: followUpMessages,
            tools,
          });

          for await (const followUpEvent of followUpStream) {
            if (followUpEvent.type === 'content_block_delta') {
              if (followUpEvent.delta.type === 'text_delta') {
                yield {
                  type: 'text',
                  content: followUpEvent.delta.text,
                };
              }
            }
          }
        }
      }
    }

    yield { type: 'done' };
  }

  /**
   * Define tools available to Claude
   */
  private getTools(): Anthropic.Messages.Tool[] {
    return [
      {
        name: 'get_stock_info',
        description: 'Get comprehensive information about a stock including price, market cap, sector, and industry.',
        input_schema: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'Stock ticker symbol (e.g., AAPL, MSFT, TSLA)',
            },
          },
          required: ['symbol'],
        },
      },
      {
        name: 'get_financial_metrics',
        description: 'Get detailed financial metrics including valuation, profitability, growth, and financial health ratios.',
        input_schema: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'Stock ticker symbol',
            },
          },
          required: ['symbol'],
        },
      },
      {
        name: 'calculate_investment_score',
        description: 'Calculate comprehensive investment score (0-100) with detailed breakdown across financial health, valuation, growth, and sentiment. Includes deep explanations for each component.',
        input_schema: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'Stock ticker symbol',
            },
          },
          required: ['symbol'],
        },
      },
      {
        name: 'get_historical_data',
        description: 'Get historical price data for charting and trend analysis.',
        input_schema: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'Stock ticker symbol',
            },
            period: {
              type: 'string',
              description: 'Time period: 1mo, 3mo, 6mo, 1y, 5y',
              enum: ['1mo', '3mo', '6mo', '1y', '5y'],
            },
          },
          required: ['symbol', 'period'],
        },
      },
      {
        name: 'compare_stocks',
        description: 'Compare multiple stocks side-by-side across key metrics.',
        input_schema: {
          type: 'object',
          properties: {
            symbols: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of stock symbols to compare (2-4 stocks)',
            },
          },
          required: ['symbols'],
        },
      },
    ];
  }

  /**
   * Execute tool calls from Claude
   */
  private async executeTool(toolName: string, input: any): Promise<any> {
    try {
      switch (toolName) {
        case 'get_stock_info':
          return await yahooFinanceService.getStockInfo(input.symbol);

        case 'get_financial_metrics':
          return await yahooFinanceService.getFinancialMetrics(input.symbol);

        case 'calculate_investment_score': {
          const [metrics, analystData, insiders] = await Promise.all([
            yahooFinanceService.getFinancialMetrics(input.symbol),
            yahooFinanceService.getAnalystData(input.symbol),
            yahooFinanceService.getInsiderTransactions(input.symbol),
          ]);

          const score = investmentScoreService.calculateScore(
            input.symbol,
            metrics,
            analystData,
            undefined, // Sentiment - will add FinGPT later
            insiders
          );

          return score;
        }

        case 'get_historical_data':
          return await yahooFinanceService.getHistoricalData(input.symbol, input.period);

        case 'compare_stocks': {
          const comparisons = await Promise.all(
            input.symbols.map(async (symbol: string) => {
              const [info, metrics, analystData] = await Promise.all([
                yahooFinanceService.getStockInfo(symbol),
                yahooFinanceService.getFinancialMetrics(symbol),
                yahooFinanceService.getAnalystData(symbol),
              ]);

              return { symbol, info, metrics, analystData };
            })
          );

          return comparisons;
        }

        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      throw error;
    }
  }
}
