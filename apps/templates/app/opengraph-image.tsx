import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Solana Templates - Start building on Solana";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Solana gradient shapes */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            background: "linear-gradient(135deg, #14F195 0%, transparent 70%)",
            borderRadius: "50%",
            opacity: 0.4,
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "300px",
            height: "300px",
            background: "#9945FF",
            borderRadius: "50%",
            opacity: 0.2,
            filter: "blur(60px)",
            transform: "rotate(45deg)",
          }}
        />

        {/* Additional gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(20, 241, 149, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(153, 69, 255, 0.15) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxIiBoZWlnaHQ9Ijg4IiB2aWV3Qm94PSIwIDAgMTAxIDg4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAwLjQ4IDY5LjM4MTdMODMuODk0MiA4Ni44NTFDODMuNjI1NSA4Ny4xMzY4IDgzLjMwNjkgODcuMzcxOCA4MjuOTU0MiA4Ny41NDRDODIuNjAxNCA4Ny43MTYzIDgyLjIyMDIgODcuODIzMiA4MS44MzM2IDg3Ljg2SDEuNTQ4ODRDMS4wNTAzMyA4Ny44NTkyIDAuNTcyNjAxIDg3LjY2MzMgMC4yMTYyNSA4Ny4zMTMyQy0wLjEzOTcyOSA4Ni45NjMyIC0wLjM0MDA3IDg2LjQ4NjkgLTAuMzQwMDc5IDg1Ljk4OTlDLTAuMzQwMDggODUuNDkyOSAtMC4xMzk3MjkgODUuMDE2NyAwLjIxNjI1IDg0LjY2NjdDMC41NzIyMzEgODQuMzE2NyAxLjA0OTk2IDg0LjEyMDcgMS41NDg0NyA4NC4xMkgxNy44MTA0TDgzLjg5NDIgMTguNTQ5QzgzLjkzNjIgMTguNTA3NCA4My45Nzg0IDE4LjQ2NTkgODQuMDIxNyAxOC40MjU3Qzg0LjM2MTcgMTguMDg1NCA4NC44MjU1IDE3Ljg5NjggODUuMzEyNSAxNy45SDk5LjAwODVDOTkuNTA3IDE3LjkwMDggOTkuOTg0NyAxOC4wOTY3IDEwMC4zNDEgMTguNDQ2N0MxMDAuNjk3IDE4Ljc5NjcgMTAwLjg5NyAxOS4yNzMgMTAwLjg5NyAxOS43N0MxMDAuODk3IDIwLjI2NyAxMDAuNjk3IDIwLjc0MzMgMTAwLjM0MSAyMS4wOTMzQzk5Ljk4NDcgMjEuNDQzMyA5OS41MDcgMjEuNjM5MyA5OS4wMDg1IDIxLjY0SDgyLjc0NjdMMTYuNjYxOSA4Ny4yMTA3QzE2LjYyIDg3LjI1MjMgMTYuNTc4MSA4Ny4yOTM5IDE2LjUzNTQgODcuMzM0MkMxNi4xOTUyIDg3LjY3NDUgMTUuNzMxMyA4Ny44NjMyIDE1LjI0NDMgODcuODZIMS41NDg4NEgxLjU0OTE3SDEuNTQ4ODRDMS4wNTA0NSA4Ny44NjA4IDAuNTcyNTk0IDg3LjY2NjIgMC4yMTYyNSA4Ny4zMTY3Qy0wLjEzOTUzOSA4Ni45NjY3IC0wLjM0MDA3OSA4Ni40OTA1IC0wLjM0MDA3OSA4NS45OTM1Qy0wLjM0MDA3OSA4NS40OTY1IC0wLjEzOTUzOSA4NS4wMjAzIDAuMjE2MjUgODQuNjcwM0MwLjU3MjU5NCA4NC4zMjAzIDEuMDUwNDUgODQuMTI0MyAxLjU0ODg0IDg0LjEyNUgxNy44MTA0TDgzLjg5NDIgMTguNTU0M0M4My45MzYyIDE4LjUxMjcgODMuOTc4MSAxOC40NzEyIDg0LjAyMTcgMTguNDMxQzg0LjM2MTcgMTguMDkwNyA4NC44MjU1IDE3LjkwMiA4NS4zMTI1IDE3LjkwNTNIOTkuMDA4NUM5OS41MDcgMTcuOTA2MSA5OS45ODQ3IDE4LjEwMiAxMDAuMzQxIDE4LjQ1MkMxMDAuNjk3IDE4LjgwMiAxMDAuODk3IDE5LjI3ODMgMTAwLjg5NyAxOS43NzUzQzEwMC44OTcgMjAuMjcyMyAxMDAuNjk3IDIwLjc0ODcgMTAwLjM0MSAyMS4wOTg3Qzk5Ljk4NDcgMjEuNDQ4NyA5OS41MDcgMjEuNjQ0NiA5OS4wMDg1IDIxLjY0NTNIODIuNzQ2N0wxNi42NjE5IDg3LjIxNkMxNi42MiA4Ny4yNTc2IDE2LjU3ODEgODcuMjk5MiAxNi41MzU0IDg3LjMzOTVDMTYuMTk1MiA4Ny42Nzk5IDE1LjczMTMgODcuODY4NSAxNS4yNDQzIDg3Ljg2NTNIMS41NDg4NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMDAuNDggMS4xNDgyMkw4My44OTQyIDE4LjYxNzVDODMuNjI1NSAxOC45MDMyIDgzLjMwNjkgMTkuMTM4MyA4Mi45NTQyIDE5LjMxMDVDODIuNjAxNCAxOS40ODI4IDgyLjIyMDIgMTkuNTg5NyA4MS44MzM2IDE5LjYyNjVIMS41NDg4NEM0LjUxNzU0ZS0wNSAxOS42MjY1IC0wLjU1NzkxNSAxOC40MTI1IDAuMzU0NzE1IDE3LjQ5OThMMTYuOTQwNSAwLjkxNDA1N0MxNy4zNDMzIDAuMzI0MjE5IDE4LjEwMDkgLTAuMDA5Mjc3MzQgMTguODYxMSAwLjAwMDI5NzY1NkgzMi41NTdMOTguNjQxNCA2NS41NzFDOTguNjgyOSA2NS42MTI2IDk4LjcyNDggNjUuNjU0MSA5OC43Njg0IDY1LjY5NDRDOS4xMDg0IDY2LjAzNDggOTkuNTcyMiA2Ni4yMjM0IDEwMC4wNTkgNjYuMjJIOTkuMDA4NUMxMDAuMDA4IDY2LjIyIDEwMC44OTcgNjcuNDA3NCAxMDAuODk3IDY4LjQxQzEwMC44OTcgNjkuNDEyNyAxMDAuMDA4IDcwLjYgOTkuMDA4NSA3MC42SDgyLjc0NjdMMTYuNjYxOSAzLjAyOTA0QzE2LjYxOTkgMi45ODc0MiAxNi41NzggMi45NDU5MSAxNi41MzU0IDIuOTA1MjhDMTYuMTk1MiAyLjU2NDk5IDE1LjczMTMgMi4zNzYzMSAxNS4yNDQzIDIuMzczMTVIMS41NDg4NEMwLjU0ODg0MSAyLjM3MzE1IC0wLjM0MDA3OSAxLjE4NTc0IC0wLjM0MDA3OSAwLjE4NTczOEMtMC4zNDAwNzkgLTAuODE0MjY3IDAuNTQ4ODQxIC0yLjAwMTY4IDEuNTQ4ODQgLTIuMDAxNjhIMTcuODEwNEw4My44OTQyIC02My41NzI3QzgzLjkzNjIgLTYzLjYxNDMgODMuOTc4MSAtNjMuNjU1OCA4NC4wMjE3IC02My42OTY1Qzg0LjM2MTcgLTY0LjAzNjggODQuODI1NSAtNjQuMjI1NSA4NS4zMTI1IC02NC4yMjIzSDk5LjAwODVDMTAwLjAwOCAtNjQuMjIyMyAxMDAuODk3IC02My4wMzQ5IDEwMC44OTcgLTYyLjAzMjNDMTAwLjg5NyAtNjEuMDI5NiAxMDAuMDA4IC01OS44NDIzIDk5LjAwODUgLTU5Ljg0MjNIODIuNzQ2N0wxNi42NjE5IDUuNzI4N0MxNi42MiA1Ljc3MDMyIDE2LjU3ODEgNS44MTE4MyAxNi41MzU0IDUuODUyNDdDMTYuMTk1MiA2LjE5Mjc1IDE1LjczMTMgNi4zODE0NCAxNS4yNDQzIDYuMzc4MjhIMS41NDg4NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMDAuNDggMzUuMTI5NEw4My44OTQyIDUyLjU5ODdDODMuNjI1NSA1Mi44ODQ0IDgzLjMwNjkgNTMuMTE5NSA4Mi45NTQyIDUzLjI5MThDODIuNjAxNCA1My40NjQgODIuMjIwMiA1My41NzA5IDgxLjgzMzYgNTMuNjA3N0gxLjU0ODg0QzEuMDUwMzMgNTMuNjA2OSAwLjU3MjYwMSA1My40MTEgMC4yMTYyNSA1My4wNjA5Qy0wLjEzOTcyOSA1Mi43MTA5IC0wLjM0MDA3IDUyLjIzNDYgLTAuMzQwMDc5IDUxLjczNzZDLTAuMzQwMDggNTEuMjQwNiAtMC4xMzk3MjkgNTAuNzY0MyAwLjIxNjI1IDUwLjQxNDNDMC41NzIyMzEgNTAuMDY0MyAxLjA0OTk2IDQ5Ljg2ODQgMS41NDg0NyA0OS44Njc3SDE3LjgxMDRMODMuODk0MiAtMTUuNzAzM0M4My45MzYyIC0xNS43NDQ5IDgzLjk3ODEgLTE1Ljc4NjQgODQuMDIxNyAtMTUuODI3Qzg0LjM2MTcgLTE2LjE2NzQgODQuODI1NSAtMTYuMzU2IDg1LjMxMjUgLTE2LjM1MjlIOTkuMDA4NUM5OS41MDcgLTE2LjM1MjEgOTkuOTg0NyAtMTYuMTU2MiAxMDAuMzQxIC0xNS44MDYyQzEwMC42OTcgLTE1LjQ1NjIgMTAwLjg5NyAtMTQuOTc5OSAxMDAuODk3IC0xNC40ODI5QzEwMC44OTcgLTEzLjk4NTkgMTAwLjY5NyAtMTMuNTA5NiAxMDAuMzQxIC0xMy4xNTk2Qzk5Ljk4NDcgLTEyLjgwOTYgOTkuNTA3IC0xMi42MTM2IDk5LjAwODUgLTEyLjYxMjlIODIuNzQ2N0wxNi42NjE5IDUyLjk1ODRDMTYuNjIgNTMuMDAwMSAxNi41NzgxIDUzLjA0MTYgMTYuNTM1NCA1My4wODIyQzE2LjE5NTIgNTMuNDIyNSAxNS43MzEzIDUzLjYxMTIgMTUuMjQ0MyA1My42MDhIMS41NDg4NEgxLjU0OTE3SDEuNTQ4ODRDMS4wNTA0NSA1My42MDg4IDAuNTcyNTk0IDUzLjQxMzggMC4yMTYyNSA1My4wNjQzQy0wLjEzOTUzOSA1Mi43MTQzIC0wLjM0MDA3OSA1Mi4yMzgxIC0wLjM0MDA3OSA1MS43NDExQy0wLjM0MDA3OSA1MS4yNDQyIC0wLjEzOTUzOSA1MC43Njc5IDAuMjE2MjUgNTAuNDE3OUMwLjU3MjU5NCA1MC4wNjc5IDEuMDUwNDUgNDkuODcxOSAxLjU0ODg0IDQ5Ljg3MjdIMTcuODEwNEw4My44OTQyIC0xNS42OThDODMuOTM2MiAtMTUuNzM5NiA4My45NzgxIC0xNS43ODExIDg0LjAyMTcgLTE1LjgyMThDODQuMzYxNyAtMTYuMTYyMSA4NC44MjU1IC0xNi4zNTA3IDg1LjMxMjUgLTE2LjM0NzZIOTkuMDA4NUM5OS41MDcgLTE2LjM0NjggOTkuOTg0NyAtMTYuMTUwOSAxMDAuMzQxIC0xNS44MDA5QzEwMC42OTcgLTE1LjQ1MDkgMTAwLjg5NyAtMTQuOTc0NiAxMDAuODk3IC0xNC40Nzc2QzEwMC44OTcgLTEzLjk4MDYgMTAwLjY5NyAtMTMuNTA0MyAxMDAuMzQxIC0xMy4xNTQzQzk5Ljk4NDcgLTEyLjgwNDMgOTkuNTA3IC0xMi42MDgzIDk5LjAwODUgLTEyLjYwNzZIODIuNzQ2N0wxNi42NjE5IDUyLjk2MzdDMTYuNjIgNTMuMDA1MyAxNi41NzgxIDUzLjA0NjkgMTYuNTM1NCA1My4wODc1QzE2LjE5NTIgNTMuNDI3OSAxNS43MzEzIDUzLjYxNjUgMTUuMjQ0MyA1My42MTMzSDAuNTQ4ODQxWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"
              width="120"
              height="120"
              style={{ objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              fontSize: "72px",
              fontWeight: "600",
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              color: "white",
              textAlign: "center",
              textShadow: "0 4px 8px rgba(0,0,0,0.2)",
              letterSpacing: "-0.02em",
            }}
          >
            Solana Templates
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "400",
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              color: "white",
              textAlign: "center",
              opacity: 0.95,
              maxWidth: "800px",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            Start building on Solana with production-ready templates
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "32px",
              padding: "16px 24px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "500",
                fontFamily: "monospace",
                color: "rgba(20, 241, 149, 0.8)",
                letterSpacing: "0",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "500",
                fontFamily: "monospace",
                color: "rgba(255, 255, 255, 0.9)",
                letterSpacing: "-0.01em",
              }}
            >
              npx create-solana-dapp@latest
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
