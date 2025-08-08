import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  diagnoseAndFixToken,
  forceClearAllTokens,
  createTestToken,
} from '../utils/tokenFixer';
import { getStoredToken, getStoredUser } from '../utils/auth';

const TokenTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const fixResult = await diagnoseAndFixToken();
      setResult(fixResult);
    } catch (error) {
      setResult({
        fixed: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = () => {
    forceClearAllTokens();
    setResult({
      fixed: true,
      reason: 'All tokens cleared',
    });
  };

  const createTest = async () => {
    setLoading(true);
    try {
      const testResult = await createTestToken();
      setResult(testResult);
    } catch (error) {
      setResult({
        fixed: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentState = () => {
    const token = getStoredToken();
    const user = getStoredUser();

    setResult({
      tokenExists: !!token,
      userExists: !!user,
      tokenLength: token?.length || 0,
      tokenFormat: token
        ? token.split('.').length === 3
          ? 'Valid JWT'
          : 'Invalid JWT'
        : 'No token',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Token Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={runDiagnostic} disabled={loading}>
                {loading ? 'Running...' : '🔍 Run Diagnostic'}
              </Button>
              <Button onClick={clearTokens} variant="destructive">
                🗑️ Clear Tokens
              </Button>
              <Button onClick={createTest} disabled={loading}>
                {loading ? 'Creating...' : '🔧 Create Test Token'}
              </Button>
              <Button onClick={checkCurrentState}>
                📊 Check Current State
              </Button>
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.fixed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenTest;
