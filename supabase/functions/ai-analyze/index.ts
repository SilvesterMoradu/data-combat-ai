import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, query } = await req.json();

    if (!projectId || !query) {
      return new Response(JSON.stringify({ error: "Missing projectId or query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client with service role key for elevated privileges
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Fetch files associated with the project
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("file_name, storage_path")
      .eq("project_id", projectId);

    if (filesError) {
      console.error("Error fetching files:", filesError);
      return new Response(JSON.stringify({ error: "Failed to fetch project files" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let fileContext = "";
    if (files && files.length > 0) {
      fileContext = "You have uploaded the following files: " + files.map(f => f.file_name).join(", ") + ". ";
      // In a real scenario, you would download and process file content here.
      // For this simulation, we'll just use the file names.
    } else {
      fileContext = "No files have been uploaded for this project yet. ";
    }

    // Simulate AI response
    const aiResponse = `Hello! ${fileContext}I can help you analyze your data for project "${projectId}". You asked: "${query}". What specific insights are you looking for?`;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});