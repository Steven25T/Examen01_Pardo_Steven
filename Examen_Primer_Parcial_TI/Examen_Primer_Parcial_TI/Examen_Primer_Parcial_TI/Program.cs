

namespace Examen_Primer_Parcial_TI
{
    class Program
    {
        static void Main(string[] args)
        {
            int n;
            //MENSAJE PARA INGRESAR EL VECTOR

            Console.Write("Ingrese el primer vector: ");
            n = int.Parse(Console.ReadLine());

            int[] v = new int[n];

            // INGRESAR EL TAMAÑO O NUMERO DE VECTORES
            for (int i = 0; i < n; i++)
            {
                Console.Write("Ingrese valor [" + i + "]: ");
                v[i] = int.Parse(Console.ReadLine());
            }

            // ORDENAR DE FORMA ASCENDENTE
            int[] ascendente = OrdenarPorIndices(v, true);

            Console.WriteLine("\nASCENDENTE:");
            Imprimir(v, ascendente);

            // ORDENAR DE FORMA DESCENDENTE
            int[] descendente = OrdenarPorIndices(v, false);

            Console.WriteLine("\nDESCENDENTE:");
            Imprimir(v, descendente);
        }
        //METODO PARA ORDENAR DE FORMA ASCENDENTE y DESCENDENTE
        static int[] OrdenarPorIndices(int[] v, bool ascendente)
        {
            int n = v.Length;
            int[] indices = new int[n];
            bool[] usados = new bool[n];

            for (int k = 0; k < n; k++)
            {
                int pos = -1;
                int valor = ascendente ? int.MaxValue : int.MinValue;

                for (int i = 0; i < n; i++)
                {
                    if (!usados[i])
                    {
                        if ((ascendente && v[i] < valor) ||
                            (!ascendente && v[i] > valor))
                        {
                            valor = v[i];
                            pos = i;
                        }
                    }
                }

                indices[k] = pos;
                usados[pos] = true;
            }

            return indices;
        }
        //METODO PARA IMPRIMIR
        static void Imprimir(int[] v, int[] indices)
        {
            for (int i = 0; i < indices.Length; i++)
            {
                Console.WriteLine(v[indices[i]]);
            }
        }
    }
}