export default function FullPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <>
            <h1>FullPage Layout</h1>
            {children}
        </>
    )
}