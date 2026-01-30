import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto text-center border-none shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="pt-12 pb-12">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-red-50 rounded-full">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you are looking for doesn't exist.
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all">
                Return Home
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
