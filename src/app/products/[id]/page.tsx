import { supabase } from "../../../../lib/supabase";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
    try {
        const { data: products } = await supabase
            .from("products")
            .select("id");

        if (products && products.length > 0) {
            return products.map((p) => ({ id: String(p.id) }));
        }
    } catch {
        // Fallback for build environments where database is unreachable
    }
    return [];
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProductDetailClient id={id} />;
}
