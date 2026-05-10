import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY ei ole asetettu');

    const { recipients, subject, textBody, senderName, replyTo } = await req.json();

    if (!recipients || recipients.length === 0) {
      throw new Error('Ei vastaanottajia');
    }

    // Lähetä jokaiselle oma sähköposti (henkilökohtaisempi)
    const results = await Promise.allSettled(
      recipients.map(async (r: { name: string; email: string }) => {
        const personalizedBody = textBody.replace(
          'Arvoisa vastaanottaja,',
          `Arvoisa ${r.name},`
        );

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `${senderName} <${Deno.env.get('SENDER_EMAIL') ?? 'noreply@example.com'}>`,
            to: [r.email],
            subject,
            text: personalizedBody,
            reply_to: replyTo ?? undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(`${r.email}: ${data.message ?? 'Virhe'}`);
        return { email: r.email, id: data.id };
      })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message ?? 'Tuntematon virhe');

    return new Response(
      JSON.stringify({ succeeded, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
