import { NextResponse } from 'next/server';

export async function GET() {
  const allEnvVars = Object.keys(process.env)
    .filter(key => key.includes('MONGODB') || key.includes('NEXTAUTH'))
    .reduce((obj, key) => {
      obj[key] = process.env[key] ? 'LOADED' : 'UNDEFINED';
      return obj;
    }, {} as Record<string, string>);

  return NextResponse.json({
    message: 'Environment variables check',
    envVars: allEnvVars,
    allKeys: Object.keys(process.env)
  });
}