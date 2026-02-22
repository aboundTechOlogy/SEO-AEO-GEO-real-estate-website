import ModalPortal from "@/components/ModalPortal";

export default function SearchLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ModalPortal>{modal}</ModalPortal>
    </>
  );
}
