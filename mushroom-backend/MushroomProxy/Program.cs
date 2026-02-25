using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Omogući serviranje statičkih fajlova (tvoj HTML/CSS/JS)
builder.Services.AddDirectoryBrowser();
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseDefaultFiles();  // index.html
app.UseStaticFiles();   // public files

app.MapPost("/predict", async (HttpRequest request, IHttpClientFactory httpFactory, IConfiguration config) =>
{
    var azureEndpoint = config["AzureML:Endpoint"];
    var apiKey = config["AzureML:ApiKey"];
    var inputName = config["AzureML:InputName"] ?? "WebServiceInput0";

    if (string.IsNullOrWhiteSpace(azureEndpoint) || string.IsNullOrWhiteSpace(apiKey))
        return Results.Problem("AzureML endpoint ili ApiKey nisu postavljeni u appsettings.json");

    // Učitaj body kao Dictionary<string, string>
    var features = await JsonSerializer.DeserializeAsync<Dictionary<string, string>>(request.Body);
    if (features == null || features.Count == 0)
        return Results.BadRequest("Nema feature-a u requestu.");

    // Složi Azure payload
    var payload = new Dictionary<string, object>
    {
        ["Inputs"] = new Dictionary<string, object>
        {
            [inputName] = new object[] { features }
        },
        ["GlobalParameters"] = new Dictionary<string, object>()
    };

    var json = JsonSerializer.Serialize(payload);
    var client = httpFactory.CreateClient();

    using var msg = new HttpRequestMessage(HttpMethod.Post, azureEndpoint);
    msg.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    msg.Content = new StringContent(json, Encoding.UTF8, "application/json");

    using var resp = await client.SendAsync(msg);
    var respText = await resp.Content.ReadAsStringAsync();

    if (!resp.IsSuccessStatusCode)
        return Results.Text($"HTTP {(int)resp.StatusCode}\n{respText}", "text/plain");

    // Vrati cijeli JSON ili izvuci 6 polja (ovdje vraćam cijeli JSON radi jednostavnosti)
    return Results.Text(respText, "application/json");
});

app.Run();